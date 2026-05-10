import { Card, PropertyColor } from './types';
import { FULL_DECK } from './cardData';

let instanceCounter = 0;

/** Create a new shuffled deck with unique instance IDs */
export function createShuffledDeck(): Card[] {
  const deck: Card[] = FULL_DECK.map((def) => ({
    ...def,
    instanceId: `card-${++instanceCounter}`,
  }));

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

/** Draw cards from the deck, reshuffling discard pile if needed */
export function drawCards(
  drawPile: Card[],
  discardPile: Card[],
  count: number
): { drawn: Card[]; newDrawPile: Card[]; newDiscardPile: Card[] } {
  let pile = [...drawPile];
  let discard = [...discardPile];
  const drawn: Card[] = [];

  for (let i = 0; i < count; i++) {
    if (pile.length === 0) {
      if (discard.length === 0) break; // no cards left at all
      // Reshuffle discard into draw
      pile = [...discard];
      discard = [];
      // Shuffle
      for (let j = pile.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [pile[j], pile[k]] = [pile[k], pile[j]];
      }
    }
    drawn.push(pile.pop()!);
  }

  return { drawn, newDrawPile: pile, newDiscardPile: discard };
}

/** Calculate bank value from a player's bank cards */
export function calculateBankValue(bank: Card[]): number {
  return bank.reduce((sum, card) => sum + card.value, 0);
}

/** Get the effective color of a wildcard property */
export function getEffectiveColor(card: Card, chosenColor?: PropertyColor): PropertyColor | null {
  if (card.category !== 'property') return null;
  if (card.colors.length === 1 && card.colors[0] !== 'multicolor') return card.colors[0];
  if (card.colors[0] === 'multicolor') return chosenColor || null;
  return chosenColor || card.colors[0]; // for two-color wildcards, default to first
}

/** Group a player's properties into color sets */
export function getPropertySets(
  properties: Card[],
  wildcardChoices?: Record<string, PropertyColor>
): Map<PropertyColor, Card[]> {
  const sets = new Map<PropertyColor, Card[]>();

  for (const card of properties) {
    if (card.category !== 'property') continue;
    const color = wildcardChoices?.[card.instanceId]
      ? wildcardChoices[card.instanceId]
      : card.colors[0];
    if (!color || color === 'multicolor') continue;
    if (!sets.has(color)) sets.set(color, []);
    sets.get(color)!.push(card);
  }

  return sets;
}

/** Check if a property set is complete */
export function isSetComplete(color: PropertyColor, cards: Card[]): boolean {
  const required = getSetSize(color);
  return cards.length >= required;
}

/** Get the required size for a property set */
export function getSetSize(color: PropertyColor): number {
  switch (color) {
    case 'brown': return 2;
    case 'lightblue': return 3;
    case 'pink': return 3;
    case 'orange': return 3;
    case 'red': return 3;
    case 'yellow': return 3;
    case 'green': return 3;
    case 'darkblue': return 2;
    case 'railroad': return 4;
    case 'utility': return 2;
    default: return 999;
  }
}

/** Calculate rent for a color set */
export function calculateRent(
  color: PropertyColor,
  cardCount: number,
  hasHouse: boolean,
  hasHotel: boolean,
  doubled: boolean
): number {
  let rent: number;
  if (color === 'railroad') {
    rent = { 1: 4, 2: 10, 3: 20, 4: 40 }[cardCount] || 4;
  } else {
    rent = cardCount * 3;
  }

  if (hasHouse) rent += 3;
  if (hasHotel) rent += 4;

  if (doubled) rent *= 2;

  return rent;
}

/** Count how many complete sets a player has */
export function countCompleteSets(properties: Card[]): number {
  const sets = getPropertySets(properties);
  let count = 0;
  sets.forEach((cards, color) => {
    if (isSetComplete(color, cards)) count++;
  });
  return count;
}

/** Check if a player has won (3 complete sets) */
export function checkWin(properties: Card[]): boolean {
  return countCompleteSets(properties) >= 3;
}
