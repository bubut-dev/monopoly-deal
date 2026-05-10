// ============================================
// MONOPOLY DEAL - TypeScript Types
// ============================================

// Property color sets
export type PropertyColor =
  | 'brown'
  | 'lightblue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'darkblue'
  | 'railroad'
  | 'utility'
  | 'multicolor';

// Card category types
export type CardCategory = 'money' | 'property' | 'rent' | 'action';

export type ActionSubtype =
  | 'dealbreaker'
  | 'justsayno'
  | 'passgo'
  | 'forceddeal'
  | 'slydeal'
  | 'debtcollector'
  | 'itsmybirthday'
  | 'doubletherent'
  | 'house'
  | 'hotel';

export interface CardDef {
  id: string;
  category: CardCategory;
  name: string;
  value: number; // monetary value for money cards, rent multiplier base for others
  colors: PropertyColor[]; // property colors this card relates to (empty for money)
  actionType?: ActionSubtype;
  rentFor?: PropertyColor[]; // which colors this rent card applies to
  label?: string; // short display label
  description?: string;
}

export interface Card extends CardDef {
  instanceId: string; // unique instance ID for each card in play
}

export type TurnPhase = 'setup' | 'draw' | 'play' | 'discard' | 'end' | 'gameover';

export interface PlayerState {
  id: number;
  name: string;
  hand: Card[];
  bank: Card[];       // money cards played face up as currency
  properties: Card[]; // property cards played face up
  buildings: { house: number; hotel: number }; // unused buildings in play
}

export type TargetMode =
  | 'none'
  | 'choose-player'         // choose a player to charge/steal from
  | 'choose-property-set'   // choose a property set (for Deal Breaker, rent targeting)
  | 'choose-property-card'  // choose a single property card (for Sly Deal)
  | 'choose-own-property'   // choose own property to give (for Forced Deal)
  | 'choose-own-card-bank'  // choose own card to put in bank
  | 'choose-wild-color';    // choose which color a wildcard becomes

export interface PendingAction {
  type: ActionSubtype | 'rent';
  sourceCard: Card;
  targetMode: TargetMode;
  selectedPlayerId?: number;
  selectedSet?: PropertyColor;
  selectedCardId?: string;
  rentDoubled?: boolean;
}

export interface GameState {
  players: PlayerState[];
  drawPile: Card[];
  discardPile: Card[];
  // playerId (room participant id) mapped by game player index
  playerClientIds?: string[];
  currentPlayerIndex: number;
  turnPhase: TurnPhase;
  cardsDrawnThisTurn: number;
  cardsPlayedThisTurn: number;
  pendingAction: PendingAction | null;
  winner: number | null; // player id or null
  message: string;
  turnCount: number;
}

export type GameAction =
  | { type: 'START_GAME'; playerCount: number }
  | { type: 'DRAW_CARDS'; count: number }
  | { type: 'PLAY_CARD'; cardInstanceId: string; targetPlayerId?: number; targetPropertyColor?: PropertyColor; targetCardInstanceId?: string; ownCardInstanceId?: string; chosenColor?: PropertyColor }
  | { type: 'END_TURN' }
  | { type: 'DISCARD_CARDS'; cardInstanceIds: string[] }
  | { type: 'SELECT_PLAYER'; playerId: number }
  | { type: 'SELECT_SET'; color: PropertyColor }
  | { type: 'SELECT_PROPERTY_CARD'; cardInstanceId: string }
  | { type: 'CANCEL_ACTION' };

// Property set sizes needed for completion
export const SET_SIZES: Record<PropertyColor, number> = {
  brown: 2,
  lightblue: 3,
  pink: 3,
  orange: 3,
  red: 3,
  yellow: 3,
  green: 3,
  darkblue: 2,
  railroad: 4,
  utility: 2,
  multicolor: 0, // not a real set
};

// Rent values by set size
export const RENT_VALUES: Record<string, Record<number, number>> = {
  default: { 1: 3, 2: 6, 3: 9, 4: 12 },
  railroad: { 1: 4, 2: 10, 3: 20, 4: 40 },
  utility: { 1: 3, 2: 6 },
};

// Property color display info
export const COLOR_INFO: Record<PropertyColor, { label: string; bg: string; border: string; text: string }> = {
  brown: { label: 'Brown', bg: 'bg-amber-900', border: 'border-amber-700', text: 'text-amber-100' },
  lightblue: { label: 'Lt Blue', bg: 'bg-sky-400', border: 'border-sky-300', text: 'text-sky-950' },
  pink: { label: 'Pink', bg: 'bg-pink-400', border: 'border-pink-300', text: 'text-pink-950' },
  orange: { label: 'Orange', bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-950' },
  red: { label: 'Red', bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-950' },
  yellow: { label: 'Yellow', bg: 'bg-yellow-400', border: 'border-yellow-300', text: 'text-yellow-950' },
  green: { label: 'Green', bg: 'bg-green-500', border: 'border-green-400', text: 'text-green-950' },
  darkblue: { label: 'Dk Blue', bg: 'bg-blue-700', border: 'border-blue-600', text: 'text-blue-100' },
  railroad: { label: 'Railroad', bg: 'bg-gray-700', border: 'border-gray-500', text: 'text-gray-100' },
  utility: { label: 'Utility', bg: 'bg-slate-600', border: 'border-slate-400', text: 'text-slate-100' },
  multicolor: { label: 'Wild', bg: 'bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500', border: 'border-white', text: 'text-white' },
};

// Standard 10-color order for display
export const COLOR_ORDER: PropertyColor[] = [
  'brown', 'lightblue', 'pink', 'orange', 'red',
  'yellow', 'green', 'darkblue', 'railroad', 'utility',
];
