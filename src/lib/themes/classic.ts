import { Theme } from './types';
import { PropertyColor } from '../types';

export const classicTheme: Theme = {
  id: 'classic',
  name: 'Classic',
  emoji: '🎩',
  subtitle: 'Original Monopoly',
  currencyPrefix: '$',
  currencySuffix: 'M',
  colorLabels: {},
  regionLabels: {
    brown: 'BROWN',
    lightblue: 'LIGHT BLUE',
    pink: 'PINK',
    orange: 'ORANGE',
    red: 'RED',
    yellow: 'YELLOW',
    green: 'GREEN',
    darkblue: 'DARK BLUE',
    railroad: 'RAILROAD',
    utility: 'UTILITY',
  },
  propertyIcon: '🏠',
  propertyIcons: {
    railroad: '🚂',
    utility: '⚡',
  },
  rentIcon: '💸',
  actionIcons: {
    dealbreaker: '💥',
    passgo: '🚶',
    forceddeal: '🔄',
    slydeal: '🤏',
    debtcollector: '🏦',
    itsmybirthday: '🎂',
    doubletherent: '✖️',
    house: '🏘️',
    hotel: '🏨',
    justsayno: '🛑',
  },
  cardOverrides: {
    'a-db': { label: 'Deal\nBreaker', description: 'Steal a full property set' },
    'a-jsn': { label: 'Just Say\nNo!', description: 'Block an action (V1: +4M to bank)' },
    'a-pg': { label: 'Pass\nGo', description: 'Draw 2 extra cards' },
    'a-fd': { label: 'Forced\nDeal', description: 'Swap a property with another player' },
    'a-sd': { label: 'Sly\nDeal', description: 'Steal a property from another player' },
    'a-dc': { label: 'Debt\nCollector', description: 'Collect 5M from a player' },
    'a-bd': { label: "It's My\nBirthday!", description: 'Collect 10M from all players' },
    'a-dtr': { label: 'Double\nthe Rent', description: 'Double your next rent charge' },
    'a-house': { label: 'House', description: 'Add to a complete set: +3M rent' },
    'a-hotel': { label: 'Hotel', description: 'Add to set with house: +4M more rent' },
  },
  cardNames: {
    // === Brown ===
    'Mediterranean Ave': { label: 'Mediterranean\nAve' },
    'Baltic Ave': { label: 'Baltic\nAve' },

    // === Light Blue ===
    'Oriental Ave': { label: 'Oriental\nAve' },
    'Vermont Ave': { label: 'Vermont\nAve' },
    'Connecticut Ave': { label: 'Connecticut\nAve' },

    // === Pink ===
    'St. Charles Place': { label: 'St. Charles\nPlace' },
    'States Ave': { label: 'States\nAve' },
    'Virginia Ave': { label: 'Virginia\nAve' },

    // === Orange ===
    'St. James Place': { label: 'St. James\nPlace' },
    'Tennessee Ave': { label: 'Tennessee\nAve' },
    'New York Ave': { label: 'New York\nAve' },

    // === Red ===
    'Kentucky Ave': { label: 'Kentucky\nAve' },
    'Indiana Ave': { label: 'Indiana\nAve' },
    'Illinois Ave': { label: 'Illinois\nAve' },

    // === Yellow ===
    'Atlantic Ave': { label: 'Atlantic\nAve' },
    'Ventnor Ave': { label: 'Ventnor\nAve' },
    'Marvin Gardens': { label: 'Marvin\nGardens' },

    // === Green ===
    'Pacific Ave': { label: 'Pacific\nAve' },
    'North Carolina Ave': { label: 'N. Carolina\nAve' },
    'Pennsylvania Ave': { label: 'Pennsylvania\nAve' },

    // === Dark Blue ===
    'Park Place': { label: 'Park\nPlace' },
    'Boardwalk': { label: 'Boardwalk' },

    // === Railroad ===
    'Reading Railroad': { label: 'Reading\nRailroad' },
    'Pennsylvania Railroad': { label: 'Pennsylvania\nRailroad' },
    'B&O Railroad': { label: 'B&O\nRailroad' },
    'Short Line': { label: 'Short\nLine' },

    // === Utility ===
    'Electric Company': { label: 'Electric\nCompany' },
    'Water Works': { label: 'Water\nWorks' },
  },
  moneyLabel: (value: number) => `$${value}M`,
  wildcardLabel: (colors: PropertyColor[]) => {
    if (colors.length > 2 || (colors.length === 1 && colors[0] === 'multicolor')) return 'Wild';
    const colorInfo: Record<string, string> = {
      brown: 'Br',
      lightblue: 'LB',
      pink: 'Pk',
      orange: 'Or',
      red: 'Rd',
      yellow: 'Yl',
      green: 'Gr',
      darkblue: 'DB',
      railroad: 'RR',
      utility: 'Util',
    };
    return colors.map(c => colorInfo[c] || c).join('/');
  },
  wildcardDescription: () => 'Wildcard Property',
  rentDescription: (rentFor: PropertyColor[], isWild: boolean) => {
    if (isWild) return 'Rent for Any Color';
    const colorNames: Record<string, string> = {
      brown: 'Brown',
      lightblue: 'Light Blue',
      pink: 'Pink',
      orange: 'Orange',
      red: 'Red',
      yellow: 'Yellow',
      green: 'Green',
      darkblue: 'Dark Blue',
      railroad: 'Railroad',
      utility: 'Utility',
    };
    return `Rent for ${rentFor.map(c => colorNames[c] || c).join(' or ')}`;
  },
  cardBackLabel: 'MONOPOLY',
};
