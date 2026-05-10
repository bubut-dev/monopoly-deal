import { PropertyColor } from '../types';

export type ThemeId = 'classic' | 'bali';

export interface ThemeCardOverrides {
  // For each card ID prefix (e.g., 'm10', 'p-brown', 'a-db'), themed display data
  name?: string;
  label?: string;
  description?: string;
  icon?: string;
}

export interface ThemeColorOverride {
  label: string; // e.g., 'Railroad' → 'Clubs'
}

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  subtitle: string;
  // Currency prefix: '$' for classic, 'Rp' for bali
  currencyPrefix: string;
  currencySuffix: string;
  // Override labels for color categories (railroad → clubs, utility → sports)
  colorLabels: Partial<Record<PropertyColor, string>>;
  // Property icon (for single-color property cards)
  propertyIcon: string;
  // Specific property icons per color
  propertyIcons: Partial<Record<PropertyColor, string>>;
  // Rent icon
  rentIcon: string;
  // Action icons per action type
  actionIcons: Partial<Record<string, string>>;
  // Card-specific overrides keyed by card ID prefix
  cardOverrides: Record<string, ThemeCardOverrides>;
  // Money card label format: (value: number) => string
  moneyLabel: (value: number) => string;
  // Wildcard description format: (colors: PropertyColor[]) => string
  wildcardLabel: (colors: PropertyColor[]) => string;
  wildcardDescription: (colors: PropertyColor[]) => string;
  // Rent card description format
  rentDescription: (rentFor: PropertyColor[], isWild: boolean) => string;
  // Face-down card back label
  cardBackLabel: string;
}
