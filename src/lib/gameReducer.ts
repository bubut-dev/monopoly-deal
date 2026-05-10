import {
  GameState,
  GameAction,
  PlayerState,
  Card,
  PropertyColor,
  PendingAction,
} from './types';
import {
  createShuffledDeck,
  drawCards,
  calculateBankValue,
  getPropertySets,
  isSetComplete,
  calculateRent,
  checkWin,
  getSetSize,
} from './deck';

// ============================================
// HELPER FUNCTIONS
// ============================================

function createPlayer(id: number): PlayerState {
  return {
    id,
    name: `Player ${id + 1}`,
    hand: [],
    bank: [],
    properties: [],
    buildings: { house: 0, hotel: 0 },
  };
}

function removeCardFromHand(hand: Card[], instanceId: string): { hand: Card[]; card: Card | null } {
  const idx = hand.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) return { hand, card: null };
  const card = hand[idx];
  return { hand: [...hand.slice(0, idx), ...hand.slice(idx + 1)], card };
}

function removeCardFromProperties(properties: Card[], instanceId: string): { properties: Card[]; card: Card | null } {
  const idx = properties.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) return { properties, card: null };
  const card = properties[idx];
  return { properties: [...properties.slice(0, idx), ...properties.slice(idx + 1)], card };
}

function removeCardFromBank(bank: Card[], instanceId: string): { bank: Card[]; card: Card | null } {
  const idx = bank.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) return { bank, card: null };
  const card = bank[idx];
  return { bank: [...bank.slice(0, idx), ...bank.slice(idx + 1)], card };
}

/** Pay rent/debt from a player - first from bank, then from properties */
function collectPayment(
  player: PlayerState,
  amount: number
): { updatedPlayer: PlayerState; collected: number; discardedProperties: Card[] } {
  let bankValue = calculateBankValue(player.bank);
  let newBank = [...player.bank];
  let newProperties = [...player.properties];
  let remaining = amount;
  const discardedProperties: Card[] = [];

  // First, pay from bank (take lowest value cards first)
  if (bankValue > 0) {
    newBank.sort((a, b) => a.value - b.value);
    for (let i = newBank.length - 1; i >= 0 && remaining > 0; i--) {
      if (newBank[i].value <= remaining) {
        remaining -= newBank[i].value;
        newBank.splice(i, 1);
      }
    }
    // If we still owe, take the smallest card for partial payment
    if (remaining > 0 && newBank.length > 0) {
      newBank.sort((a, b) => a.value - b.value);
      remaining -= newBank[0].value;
      newBank.splice(0, 1);
    }
  }

  // Then pay from properties if still owed
  if (remaining > 0) {
    for (let i = newProperties.length - 1; i >= 0 && remaining > 0; i--) {
      remaining -= 1; // properties count as 1M each? No - actually in Monopoly Deal,
      // you can't break properties for payment in most rulesets.
      // Let's just take properties one by one (each worth 0 in payment)
      // Actually the rule is: if you can't pay in money, you give ALL your properties and bank.
      // Let's simplify: give all remaining if can't pay
    }
    // Simplified: if can't pay with bank, give everything
    if (remaining > 0) {
      discardedProperties.push(...newProperties);
      newProperties = [];
      newBank = [];
    }
  }

  return {
    updatedPlayer: { ...player, bank: newBank, properties: newProperties },
    collected: amount - remaining,
    discardedProperties,
  };
}

// ============================================
// INITIAL STATE
// ============================================

export const initialState: GameState = {
  players: [],
  drawPile: [],
  discardPile: [],
  currentPlayerIndex: 0,
  turnPhase: 'setup',
  cardsDrawnThisTurn: 0,
  cardsPlayedThisTurn: 0,
  pendingAction: null,
  winner: null,
  message: 'Welcome to Monopoly Deal!',
  turnCount: 0,
};

// ============================================
// MAIN REDUCER
// ============================================

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return startGame(state, action.playerCount);

    case 'DRAW_CARDS':
      return handleDraw(state, action.count);

    case 'PLAY_CARD':
      return handlePlayCard(state, action);

    case 'END_TURN':
      return handleEndTurn(state);

    case 'DISCARD_CARDS':
      return handleDiscard(state, action.cardInstanceIds);

    case 'SELECT_PLAYER':
      return handleSelectPlayer(state, action.playerId);

    case 'SELECT_SET':
      return handleSelectSet(state, action.color);

    case 'SELECT_PROPERTY_CARD':
      return handleSelectPropertyCard(state, action.cardInstanceId);

    case 'CANCEL_ACTION':
      return {
        ...state,
        pendingAction: null,
        message: 'Action cancelled.',
      };

    default:
      return state;
  }
}

// ============================================
// ACTION HANDLERS
// ============================================

function startGame(state: GameState, playerCount: number): GameState {
  const deck = createShuffledDeck();
  const players: PlayerState[] = [];

  for (let i = 0; i < playerCount; i++) {
    players.push(createPlayer(i));
  }

  // Deal 5 cards to each player
  let currentDeck = [...deck];
  for (let i = 0; i < playerCount; i++) {
    const { drawn, newDrawPile } = drawCards(currentDeck, [], 5);
    players[i] = { ...players[i], hand: drawn };
    currentDeck = newDrawPile;
  }

  return {
    ...state,
    players,
    drawPile: currentDeck,
    discardPile: [],
    currentPlayerIndex: 0,
    turnPhase: 'draw',
    cardsDrawnThisTurn: 0,
    cardsPlayedThisTurn: 0,
    pendingAction: null,
    winner: null,
    message: `Player 1's turn — Draw 2 cards to begin!`,
    turnCount: 1,
  };
}

function handleDraw(state: GameState, count: number): GameState {
  if (state.turnPhase !== 'draw') return state;

  const player = state.players[state.currentPlayerIndex];
  const { drawn, newDrawPile, newDiscardPile } = drawCards(
    state.drawPile,
    state.discardPile,
    count
  );

  const newHand = [...player.hand, ...drawn];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  return {
    ...state,
    players: newPlayers,
    drawPile: newDrawPile,
    discardPile: newDiscardPile,
    cardsDrawnThisTurn: state.cardsDrawnThisTurn + count,
    turnPhase: 'play',
    message: `Player ${state.currentPlayerIndex + 1}: Play up to 3 cards or end your turn.`,
  };
}

function handlePlayCard(state: GameState, action: Extract<GameAction, { type: 'PLAY_CARD' }>): GameState {
  if (state.turnPhase !== 'play') return state;

  const player = state.players[state.currentPlayerIndex];
  const { hand: newHand, card } = removeCardFromHand(player.hand, action.cardInstanceId);
  if (!card) return state;

  // If there's a pending action, handle targeting
  if (state.pendingAction) {
    return handlePendingActionTarget(state, action, card);
  }

  // Check plays remaining
  if (state.cardsPlayedThisTurn >= 3) {
    return { ...state, message: 'No more plays this turn! End your turn.' };
  }

  // Route by card type
  switch (card.category) {
    case 'money':
      return playMoney(state, card, player, newHand);

    case 'property':
      return playProperty(state, card, player, newHand, action.chosenColor);

    case 'rent':
      return playRent(state, card, player, newHand);

    case 'action':
      return playAction(state, card, player, newHand);

    default:
      return state;
  }
}

function playMoney(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  const newBank = [...player.bank, card];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand, bank: newBank };

  return {
    ...state,
    players: newPlayers,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Played ${card.name} to bank (+$${card.value}M)`,
  };
}

function playProperty(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[],
  chosenColor?: PropertyColor
): GameState {
  // For wildcards that need color choice, if no color chosen yet and it's a multicolor,
  // we need to ask. For V1, default to first color.
  const color = chosenColor || card.colors[0];
  const newProperties = [...player.properties, card];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand, properties: newProperties };

  // Check for win
  if (checkWin(newProperties)) {
    return {
      ...state,
      players: newPlayers,
      cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
      winner: player.id,
      turnPhase: 'gameover',
      message: `🎉 Player ${player.id + 1} wins with 3 complete property sets! 🎉`,
    };
  }

  return {
    ...state,
    players: newPlayers,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Played ${card.name} to properties`,
  };
}

function playRent(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Check if player has any properties to charge rent for
  const propSets = getPropertySets(player.properties);
  const hasProperties = propSets.size > 0;

  if (!hasProperties) {
    // Can't play rent without properties - return card to hand
    const restoredHand = [...newHand, card];
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayerIndex] = { ...player, hand: restoredHand };
    return {
      ...state,
      players: newPlayers,
      message: "Can't play rent — you have no properties!",
    };
  }

  // For rent cards, set up pending action to choose which color to charge
  const isWildRent = card.rentFor?.length === 0; // wild rent

  if (isWildRent) {
    // Wild rent: charge for ALL property sets
    return executeRentCharge(state, card, player, newHand, null);
  }

  // Specific rent: charge for one of the two colors
  const rentColors = card.rentFor || card.colors;

  // Find which colors the player actually has
  const availableColors = rentColors.filter((c) => propSets.has(c));

  if (availableColors.length === 0) {
    // Return card to hand
    const restoredHand = [...newHand, card];
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayerIndex] = { ...player, hand: restoredHand };
    return {
      ...state,
      players: newPlayers,
      message: `Can't play rent — you don't have any ${rentColors.join('/')} properties!`,
    };
  }

  if (availableColors.length === 1) {
    return executeRentCharge(state, card, player, newHand, availableColors[0]);
  }

  // Multiple colors available - pick the one with higher rent
  // For simplicity, auto-pick the better one
  let bestColor = availableColors[0];
  let bestRent = 0;
  for (const c of availableColors) {
    const cards = propSets.get(c) || [];
    const rent = calculateRent(c, cards.length, false, false, false);
    if (rent > bestRent) {
      bestRent = rent;
      bestColor = c;
    }
  }

  return executeRentCharge(state, card, player, newHand, bestColor);
}

function executeRentCharge(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[],
  chargeColor: PropertyColor | null
): GameState {
  const newDiscard = [...state.discardPile, card];
  const propSets = getPropertySets(player.properties);

  let totalCollected = 0;
  const newPlayers = [...state.players];

  // Update current player
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  if (chargeColor) {
    // Charge for specific color
    const cards = propSets.get(chargeColor) || [];
    const hasHouse = player.buildings.house > 0 && isSetComplete(chargeColor, cards);
    const hasHotel = player.buildings.hotel > 0 && hasHouse;
    const rent = calculateRent(chargeColor, cards.length, hasHouse, hasHotel, false);

    for (let i = 0; i < newPlayers.length; i++) {
      if (i === state.currentPlayerIndex) continue;
      const result = collectPayment(newPlayers[i], rent);
      newPlayers[i] = result.updatedPlayer;
      totalCollected += result.collected;
    }
  } else {
    // Wild rent: charge for ALL sets
    propSets.forEach((cards, color) => {
      const rent = calculateRent(color, cards.length, false, false, false);
      for (let i = 0; i < newPlayers.length; i++) {
        if (i === state.currentPlayerIndex) continue;
        const result = collectPayment(newPlayers[i], rent);
        newPlayers[i] = result.updatedPlayer;
        totalCollected += result.collected;
      }
    });
  }

  const rentLabel = chargeColor ? `${chargeColor} rent` : 'all rents';

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Charged ${rentLabel} — collected $${totalCollected}M total`,
  };
}

function playAction(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  if (!card.actionType) return state;

  switch (card.actionType) {
    case 'passgo':
      return handlePassGo(state, card, player, newHand);

    case 'doubletherent':
      // In V1, simplified: just discard it, next rent will be doubled conceptually
      // Actually, for simplicity, we'll just treat it as a bank card worth 0
      return handleDoubleTheRent(state, card, player, newHand);

    case 'debtcollector':
      return handleDebtCollector(state, card, player, newHand);

    case 'itsmybirthday':
      return handleItsMyBirthday(state, card, player, newHand);

    case 'dealbreaker':
      return handleDealBreakerSetup(state, card, player, newHand);

    case 'slydeal':
      return handleSlyDealSetup(state, card, player, newHand);

    case 'forceddeal':
      return handleForcedDealSetup(state, card, player, newHand);

    case 'house':
      return handleHouse(state, card, player, newHand);

    case 'hotel':
      return handleHotel(state, card, player, newHand);

    case 'justsayno':
      // V1: treat as money card worth 4M
      return playAsMoney(state, card, player, newHand);

    default:
      return state;
  }
}

function playAsMoney(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  const newBank = [...player.bank, card];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand, bank: newBank };

  return {
    ...state,
    players: newPlayers,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Played ${card.name} to bank (+$${card.value}M)`,
  };
}

function handlePassGo(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Draw 2 extra cards
  const { drawn, newDrawPile, newDiscardPile } = drawCards(
    state.drawPile,
    state.discardPile,
    2
  );

  const finalHand = [...newHand, ...drawn];
  const newDiscard = [...newDiscardPile, card];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: finalHand };

  return {
    ...state,
    players: newPlayers,
    drawPile: newDrawPile,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Pass Go! Drew 2 extra cards`,
  };
}

function handleDoubleTheRent(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // In V1, double the rent is simplified. We'll add it to bank as 0 value.
  // The actual doubling effect is complex to implement properly without
  // a multi-step play system. For V1, treat as discard.
  const newDiscard = [...state.discardPile, card];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Double the Rent played (V1: rent doubling not fully implemented)`,
  };
}

function handleDebtCollector(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Charge 5M from each other player
  const newDiscard = [...state.discardPile, card];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  let totalCollected = 0;
  for (let i = 0; i < newPlayers.length; i++) {
    if (i === state.currentPlayerIndex) continue;
    const result = collectPayment(newPlayers[i], 5);
    newPlayers[i] = result.updatedPlayer;
    totalCollected += result.collected;
  }

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Debt Collector! Collected $${totalCollected}M from all players`,
  };
}

function handleItsMyBirthday(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Charge 10M from each other player
  const newDiscard = [...state.discardPile, card];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  let totalCollected = 0;
  for (let i = 0; i < newPlayers.length; i++) {
    if (i === state.currentPlayerIndex) continue;
    const result = collectPayment(newPlayers[i], 10);
    newPlayers[i] = result.updatedPlayer;
    totalCollected += result.collected;
  }

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `It's My Birthday! Collected $${totalCollected}M from all players`,
  };
}

function handleDealBreakerSetup(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Find opponents with complete sets
  const opponents = state.players.filter(
    (p) => p.id !== state.currentPlayerIndex
  );

  const opponentsWithSets: { playerId: number; color: PropertyColor; cards: Card[] }[] = [];

  for (const opp of opponents) {
    const sets = getPropertySets(opp.properties);
    sets.forEach((cards, color) => {
      if (isSetComplete(color, cards)) {
        opponentsWithSets.push({ playerId: opp.id, color, cards });
      }
    });
  }

  if (opponentsWithSets.length === 0) {
    // No complete sets to steal - return card to hand
    const restoredHand = [...newHand, card];
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayerIndex] = { ...player, hand: restoredHand };
    return {
      ...state,
      players: newPlayers,
      message: 'No opponents have complete property sets to steal!',
    };
  }

  // Auto-steal the first complete set found (V1 simplification)
  const target = opponentsWithSets[0];
  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  // Remove set from target player
  const targetPlayer = newPlayers[target.playerId];
  const stolenCards = target.cards;
  const newProps = targetPlayer.properties.filter(
    (c) => !stolenCards.some((sc) => sc.instanceId === c.instanceId)
  );
  newPlayers[target.playerId] = { ...targetPlayer, properties: newProps };

  // Add to current player
  const currentPlayer = newPlayers[state.currentPlayerIndex];
  const currentProps = [...currentPlayer.properties, ...stolenCards];
  newPlayers[state.currentPlayerIndex] = { ...currentPlayer, properties: currentProps };

  const newDiscard = [...state.discardPile, card];

  // Check win
  if (checkWin(currentProps)) {
    return {
      ...state,
      players: newPlayers,
      discardPile: newDiscard,
      cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
      winner: player.id,
      turnPhase: 'gameover',
      message: `🎉 Deal Breaker! Player ${player.id + 1} steals ${target.color} set and wins! 🎉`,
    };
  }

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Deal Breaker! Stole ${target.color} set from Player ${target.playerId + 1}`,
  };
}

function handleSlyDealSetup(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Find opponents with properties
  const opponents = state.players.filter(
    (p) => p.id !== state.currentPlayerIndex && p.properties.length > 0
  );

  if (opponents.length === 0) {
    const restoredHand = [...newHand, card];
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayerIndex] = { ...player, hand: restoredHand };
    return {
      ...state,
      players: newPlayers,
      message: 'No opponents have properties to steal!',
    };
  }

  // Auto-steal first property from first opponent with properties (V1)
  const target = opponents[0];
  const stolenCard = target.properties[0];

  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  // Remove from target
  const newTargetProps = target.properties.filter(
    (c) => c.instanceId !== stolenCard.instanceId
  );
  newPlayers[target.id] = { ...target, properties: newTargetProps };

  // Add to current player
  const currentPlayer = newPlayers[state.currentPlayerIndex];
  const currentProps = [...currentPlayer.properties, stolenCard];
  newPlayers[state.currentPlayerIndex] = { ...currentPlayer, properties: currentProps };

  const newDiscard = [...state.discardPile, card];

  if (checkWin(currentProps)) {
    return {
      ...state,
      players: newPlayers,
      discardPile: newDiscard,
      cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
      winner: player.id,
      turnPhase: 'gameover',
      message: `🎉 Sly Deal! Player ${player.id + 1} steals a property and wins! 🎉`,
    };
  }

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Sly Deal! Stole ${stolenCard.name} from Player ${target.id + 1}`,
  };
}

function handleForcedDealSetup(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Find opponents with properties
  const opponents = state.players.filter(
    (p) => p.id !== state.currentPlayerIndex && p.properties.length > 0
  );

  if (opponents.length === 0 || player.properties.length === 0) {
    const restoredHand = [...newHand, card];
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayerIndex] = { ...player, hand: restoredHand };
    return {
      ...state,
      players: newPlayers,
      message: 'Need properties to swap with an opponent!',
    };
  }

  // Auto-swap: take opponent's first property, give them our first property (V1)
  const target = opponents[0];
  const theirCard = target.properties[0];
  const myCard = player.properties[0];

  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  // Swap
  const myNewProps = player.properties.map((c) =>
    c.instanceId === myCard.instanceId ? theirCard : c
  );
  const theirNewProps = target.properties.map((c) =>
    c.instanceId === theirCard.instanceId ? myCard : c
  );

  newPlayers[state.currentPlayerIndex] = {
    ...newPlayers[state.currentPlayerIndex],
    properties: myNewProps,
  };
  newPlayers[target.id] = { ...target, properties: theirNewProps };

  const newDiscard = [...state.discardPile, card];

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Forced Deal! Swapped ${myCard.name} for ${theirCard.name} with Player ${target.id + 1}`,
  };
}

function handleHouse(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Check if player has a complete set to put house on
  const propSets = getPropertySets(player.properties);
  let hasCompleteSet = false;
  propSets.forEach((cards, color) => {
    if (isSetComplete(color, cards) && player.buildings.hotel === 0) {
      hasCompleteSet = true;
    }
  });

  if (!hasCompleteSet) {
    const restoredHand = [...newHand, card];
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayerIndex] = { ...player, hand: restoredHand };
    return {
      ...state,
      players: newPlayers,
      message: 'Need a complete set without a hotel to add a house!',
    };
  }

  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = {
    ...player,
    hand: newHand,
    buildings: { ...player.buildings, house: player.buildings.house + 1 },
  };

  const newDiscard = [...state.discardPile, card];

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `House added to a complete set! (+$3M rent)`,
  };
}

function handleHotel(
  state: GameState,
  card: Card,
  player: PlayerState,
  newHand: Card[]
): GameState {
  // Check if player has a complete set with a house
  const propSets = getPropertySets(player.properties);
  let hasSetWithHouse = false;
  propSets.forEach((cards, color) => {
    if (isSetComplete(color, cards) && player.buildings.house > 0) {
      hasSetWithHouse = true;
    }
  });

  if (!hasSetWithHouse) {
    const restoredHand = [...newHand, card];
    const newPlayers = [...state.players];
    newPlayers[state.currentPlayerIndex] = { ...player, hand: restoredHand };
    return {
      ...state,
      players: newPlayers,
      message: 'Need a complete set with a house to add a hotel!',
    };
  }

  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = {
    ...player,
    hand: newHand,
    buildings: { house: player.buildings.house - 1, hotel: player.buildings.hotel + 1 },
  };

  const newDiscard = [...state.discardPile, card];

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    message: `Hotel added! (+$4M more rent on top of house)`,
  };
}

// ============================================
// PENDING ACTION HANDLERS
// ============================================

function handlePendingActionTarget(
  state: GameState,
  action: Extract<GameAction, { type: 'PLAY_CARD' }>,
  _card: Card
): GameState {
  // V1: simplified - pending actions are auto-resolved
  return state;
}

function handleSelectPlayer(state: GameState, _playerId: number): GameState {
  return state; // V1: not used
}

function handleSelectSet(state: GameState, _color: PropertyColor): GameState {
  return state; // V1: not used
}

function handleSelectPropertyCard(state: GameState, _cardInstanceId: string): GameState {
  return state; // V1: not used
}

// ============================================
// TURN MANAGEMENT
// ============================================

function handleEndTurn(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex];

  // Auto-discard down to 7 if needed
  let newHand = [...player.hand];
  const newDiscard = [...state.discardPile];

  if (newHand.length > 7) {
    // Discard from the end (simplest approach)
    const excess = newHand.length - 7;
    const discarded = newHand.splice(newHand.length - excess, excess);
    newDiscard.push(...discarded);
  }

  // Move to next player
  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  return {
    ...state,
    players: newPlayers,
    discardPile: newDiscard,
    currentPlayerIndex: nextPlayerIndex,
    turnPhase: 'draw',
    cardsDrawnThisTurn: 0,
    cardsPlayedThisTurn: 0,
    pendingAction: null,
    message: `Player ${nextPlayerIndex + 1}'s turn — Draw 2 cards!`,
    turnCount: state.turnCount + 1,
  };
}

function handleDiscard(
  state: GameState,
  cardInstanceIds: string[]
): GameState {
  if (state.turnPhase !== 'discard') return state;

  const player = state.players[state.currentPlayerIndex];
  const newHand = player.hand.filter(
    (c) => !cardInstanceIds.includes(c.instanceId)
  );
  const discardedCards = player.hand.filter((c) =>
    cardInstanceIds.includes(c.instanceId)
  );

  const newPlayers = [...state.players];
  newPlayers[state.currentPlayerIndex] = { ...player, hand: newHand };

  return {
    ...state,
    players: newPlayers,
    discardPile: [...state.discardPile, ...discardedCards],
    turnPhase: 'play',
    message: `Discarded ${discardedCards.length} card(s).`,
  };
}
