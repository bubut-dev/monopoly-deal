import { CardDef, PropertyColor } from './types';

let cardCounter = 0;
function cid(prefix: string): string {
  return `${prefix}-${++cardCounter}`;
}

// ============================================
// MONEY CARDS (20 cards)
// ============================================
const moneyCards: CardDef[] = [
  // 10M (2)
  ...Array(2).fill(null).map(() => ({
    id: cid('m10'), category: 'money' as const, name: '$10M', value: 10,
    colors: [], label: '$10M', description: 'Money',
  })),
  // 5M (4)
  ...Array(4).fill(null).map(() => ({
    id: cid('m5'), category: 'money' as const, name: '$5M', value: 5,
    colors: [], label: '$5M', description: 'Money',
  })),
  // 4M (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('m4'), category: 'money' as const, name: '$4M', value: 4,
    colors: [], label: '$4M', description: 'Money',
  })),
  // 3M (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('m3'), category: 'money' as const, name: '$3M', value: 3,
    colors: [], label: '$3M', description: 'Money',
  })),
  // 2M (4)
  ...Array(4).fill(null).map(() => ({
    id: cid('m2'), category: 'money' as const, name: '$2M', value: 2,
    colors: [], label: '$2M', description: 'Money',
  })),
  // 1M (4)
  ...Array(4).fill(null).map(() => ({
    id: cid('m1'), category: 'money' as const, name: '$1M', value: 1,
    colors: [], label: '$1M', description: 'Money',
  })),
];

// ============================================
// PROPERTY CARDS (28 cards, 10 color sets)
// ============================================
const propertyCards: CardDef[] = [
  // Brown (2)
  ...Array(2).fill(null).map(() => ({
    id: cid('p-brown'), category: 'property' as const, name: 'Brown Property',
    value: 0, colors: ['brown' as PropertyColor], label: 'Brown', description: 'Property',
  })),
  // Light Blue (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('p-lb'), category: 'property' as const, name: 'Light Blue Property',
    value: 0, colors: ['lightblue' as PropertyColor], label: 'Lt Blue', description: 'Property',
  })),
  // Pink (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('p-pink'), category: 'property' as const, name: 'Pink Property',
    value: 0, colors: ['pink' as PropertyColor], label: 'Pink', description: 'Property',
  })),
  // Orange (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('p-ora'), category: 'property' as const, name: 'Orange Property',
    value: 0, colors: ['orange' as PropertyColor], label: 'Orange', description: 'Property',
  })),
  // Red (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('p-red'), category: 'property' as const, name: 'Red Property',
    value: 0, colors: ['red' as PropertyColor], label: 'Red', description: 'Property',
  })),
  // Yellow (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('p-yel'), category: 'property' as const, name: 'Yellow Property',
    value: 0, colors: ['yellow' as PropertyColor], label: 'Yellow', description: 'Property',
  })),
  // Green (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('p-grn'), category: 'property' as const, name: 'Green Property',
    value: 0, colors: ['green' as PropertyColor], label: 'Green', description: 'Property',
  })),
  // Dark Blue (2)
  ...Array(2).fill(null).map(() => ({
    id: cid('p-db'), category: 'property' as const, name: 'Dark Blue Property',
    value: 0, colors: ['darkblue' as PropertyColor], label: 'Dk Blue', description: 'Property',
  })),
  // Railroad (4)
  ...Array(4).fill(null).map(() => ({
    id: cid('p-rr'), category: 'property' as const, name: 'Railroad',
    value: 0, colors: ['railroad' as PropertyColor], label: 'Railroad', description: 'Property',
  })),
  // Utility (2)
  ...Array(2).fill(null).map(() => ({
    id: cid('p-util'), category: 'property' as const, name: 'Utility',
    value: 0, colors: ['utility' as PropertyColor], label: 'Utility', description: 'Property',
  })),
];

// ============================================
// PROPERTY WILDCARDS (11 cards)
// ============================================
const wildcardCards: CardDef[] = [
  // Brown/Light Blue (1)
  {
    id: cid('w-blb'), category: 'property', name: 'Brown/Lt Blue',
    value: 0, colors: ['brown', 'lightblue'], label: 'Br/LB', description: 'Wildcard Property',
  },
  // Light Blue/Pink (1)
  {
    id: cid('w-lbp'), category: 'property', name: 'Lt Blue/Pink',
    value: 0, colors: ['lightblue', 'pink'], label: 'LB/Pk', description: 'Wildcard Property',
  },
  // Pink/Orange (1)
  {
    id: cid('w-po'), category: 'property', name: 'Pink/Orange',
    value: 0, colors: ['pink', 'orange'], label: 'Pk/Or', description: 'Wildcard Property',
  },
  // Orange/Red (1)
  {
    id: cid('w-or'), category: 'property', name: 'Orange/Red',
    value: 0, colors: ['orange', 'red'], label: 'Or/Rd', description: 'Wildcard Property',
  },
  // Red/Yellow (1)
  {
    id: cid('w-ry'), category: 'property', name: 'Red/Yellow',
    value: 0, colors: ['red', 'yellow'], label: 'Rd/Yl', description: 'Wildcard Property',
  },
  // Yellow/Green (1)
  {
    id: cid('w-yg'), category: 'property', name: 'Yellow/Green',
    value: 0, colors: ['yellow', 'green'], label: 'Yl/Gr', description: 'Wildcard Property',
  },
  // Green/Dark Blue (1)
  {
    id: cid('w-gdb'), category: 'property', name: 'Green/Dk Blue',
    value: 0, colors: ['green', 'darkblue'], label: 'Gr/DB', description: 'Wildcard Property',
  },
  // Dark Blue/Railroad (1)
  {
    id: cid('w-dbrr'), category: 'property', name: 'Dk Blue/Railroad',
    value: 0, colors: ['darkblue', 'railroad'], label: 'DB/RR', description: 'Wildcard Property',
  },
  // Railroad/Utility (1)
  {
    id: cid('w-rru'), category: 'property', name: 'Railroad/Utility',
    value: 0, colors: ['railroad', 'utility'], label: 'RR/Util', description: 'Wildcard Property',
  },
  // Utility/Brown (1)
  {
    id: cid('w-ub'), category: 'property', name: 'Utility/Brown',
    value: 0, colors: ['utility', 'brown'], label: 'Util/Br', description: 'Wildcard Property',
  },
  // Multicolor (1)
  {
    id: cid('w-multi'), category: 'property', name: 'Multicolor',
    value: 0, colors: ['multicolor'], label: 'Wild', description: 'Any Color Property',
  },
];

// ============================================
// RENT CARDS (13 cards)
// ============================================
const rentCards: CardDef[] = [
  // Dark Blue / Green Rent (1)
  {
    id: cid('r-dbg'), category: 'rent', name: 'Dark Blue/Green Rent',
    value: 0, colors: ['darkblue', 'green'], rentFor: ['darkblue', 'green'],
    label: 'DB/Gr', description: 'Rent for Dark Blue or Green',
  },
  // Red / Yellow Rent (1)
  {
    id: cid('r-ry'), category: 'rent', name: 'Red/Yellow Rent',
    value: 0, colors: ['red', 'yellow'], rentFor: ['red', 'yellow'],
    label: 'Rd/Yl', description: 'Rent for Red or Yellow',
  },
  // Pink / Orange Rent (1)
  {
    id: cid('r-po'), category: 'rent', name: 'Pink/Orange Rent',
    value: 0, colors: ['pink', 'orange'], rentFor: ['pink', 'orange'],
    label: 'Pk/Or', description: 'Rent for Pink or Orange',
  },
  // Light Blue / Brown Rent (1)
  {
    id: cid('r-lbb'), category: 'rent', name: 'Lt Blue/Brown Rent',
    value: 0, colors: ['lightblue', 'brown'], rentFor: ['lightblue', 'brown'],
    label: 'LB/Br', description: 'Rent for Light Blue or Brown',
  },
  // Railroad / Utility Rent (1)
  {
    id: cid('r-rru'), category: 'rent', name: 'Railroad/Utility Rent',
    value: 0, colors: ['railroad', 'utility'], rentFor: ['railroad', 'utility'],
    label: 'RR/Util', description: 'Rent for Railroad or Utility',
  },
  // Wild Rent (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('r-wild'), category: 'rent' as const, name: 'Wild Rent',
    value: 0, colors: [] as PropertyColor[], rentFor: [] as PropertyColor[],
    label: 'Any', description: 'Rent for Any Color',
  })),
  // Additional copies to fill out to 13
  // Extra Dark Blue/Green (1)
  {
    id: cid('r-dbg2'), category: 'rent', name: 'Dark Blue/Green Rent',
    value: 0, colors: ['darkblue', 'green'], rentFor: ['darkblue', 'green'],
    label: 'DB/Gr', description: 'Rent for Dark Blue or Green',
  },
  // Extra Red/Yellow (1)
  {
    id: cid('r-ry2'), category: 'rent', name: 'Red/Yellow Rent',
    value: 0, colors: ['red', 'yellow'], rentFor: ['red', 'yellow'],
    label: 'Rd/Yl', description: 'Rent for Red or Yellow',
  },
  // Extra Pink/Orange (1)
  {
    id: cid('r-po2'), category: 'rent', name: 'Pink/Orange Rent',
    value: 0, colors: ['pink', 'orange'], rentFor: ['pink', 'orange'],
    label: 'Pk/Or', description: 'Rent for Pink or Orange',
  },
  // Extra Light Blue/Brown (1)
  {
    id: cid('r-lbb2'), category: 'rent', name: 'Lt Blue/Brown Rent',
    value: 0, colors: ['lightblue', 'brown'], rentFor: ['lightblue', 'brown'],
    label: 'LB/Br', description: 'Rent for Light Blue or Brown',
  },
  // Extra Railroad/Utility (1)
  {
    id: cid('r-rru2'), category: 'rent', name: 'Railroad/Utility Rent',
    value: 0, colors: ['railroad', 'utility'], rentFor: ['railroad', 'utility'],
    label: 'RR/Util', description: 'Rent for Railroad or Utility',
  },
];

// ============================================
// ACTION CARDS (34 cards, excluding Rule cards)
// ============================================
const actionCards: CardDef[] = [
  // Deal Breaker (2)
  ...Array(2).fill(null).map(() => ({
    id: cid('a-db'), category: 'action' as const, name: 'Deal Breaker',
    value: 0, colors: [], actionType: 'dealbreaker' as const,
    label: 'Deal\nBreaker', description: 'Steal a full property set',
  })),
  // Just Say No (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('a-jsn'), category: 'action' as const, name: 'Just Say No!',
    value: 4, colors: [], actionType: 'justsayno' as const,
    label: 'Just Say\nNo!', description: 'Block an action (V1: +4M to bank)',
  })),
  // Pass Go (10)
  ...Array(10).fill(null).map(() => ({
    id: cid('a-pg'), category: 'action' as const, name: 'Pass Go',
    value: 0, colors: [], actionType: 'passgo' as const,
    label: 'Pass\nGo', description: 'Draw 2 extra cards',
  })),
  // Forced Deal (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('a-fd'), category: 'action' as const, name: 'Forced Deal',
    value: 0, colors: [], actionType: 'forceddeal' as const,
    label: 'Forced\nDeal', description: 'Swap a property with another player',
  })),
  // Sly Deal (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('a-sd'), category: 'action' as const, name: 'Sly Deal',
    value: 0, colors: [], actionType: 'slydeal' as const,
    label: 'Sly\nDeal', description: 'Steal a property from another player',
  })),
  // Debt Collector (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('a-dc'), category: 'action' as const, name: 'Debt Collector',
    value: 0, colors: [], actionType: 'debtcollector' as const,
    label: 'Debt\nCollector', description: 'Collect 5M from a player',
  })),
  // It's My Birthday! (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('a-bd'), category: 'action' as const, name: "It's My Birthday!",
    value: 0, colors: [], actionType: 'itsmybirthday' as const,
    label: "It's My\nBirthday!", description: 'Collect 10M from all players',
  })),
  // Double the Rent (2)
  ...Array(2).fill(null).map(() => ({
    id: cid('a-dtr'), category: 'action' as const, name: 'Double the Rent',
    value: 0, colors: [], actionType: 'doubletherent' as const,
    label: 'Double\nthe Rent', description: 'Double your next rent charge',
  })),
  // House (3)
  ...Array(3).fill(null).map(() => ({
    id: cid('a-house'), category: 'action' as const, name: 'House',
    value: 0, colors: [], actionType: 'house' as const,
    label: 'House', description: 'Add to a complete set: +3M rent',
  })),
  // Hotel (2)
  ...Array(2).fill(null).map(() => ({
    id: cid('a-hotel'), category: 'action' as const, name: 'Hotel',
    value: 0, colors: [], actionType: 'hotel' as const,
    label: 'Hotel', description: 'Add to set with house: +4M more rent',
  })),
];

// ============================================
// FULL DECK
// ============================================
export const FULL_DECK: CardDef[] = [
  ...moneyCards,     // 20
  ...propertyCards,  // 28
  ...wildcardCards,  // 11
  ...rentCards,      // 13
  ...actionCards,    // 34
  // Total: 106 cards (110 - 4 rule cards excluded)
];

export const PLAYER_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
