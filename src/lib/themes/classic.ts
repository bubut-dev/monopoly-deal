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
