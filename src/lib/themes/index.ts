import { Theme, ThemeId } from './types';
import { classicTheme } from './classic';
import { baliTheme } from './bali';
import { PropertyColor, COLOR_INFO } from '../types';

export const themes: Record<ThemeId, Theme> = {
  classic: classicTheme,
  bali: baliTheme,
};

export const themeList = Object.values(themes);

export function getTheme(id: ThemeId): Theme {
  return themes[id] || classicTheme;
}

/**
 * Get themed color label (e.g., 'Railroad' → 'Clubs' in Bali theme)
 */
export function getThemedColorLabel(color: PropertyColor, theme: Theme): string {
  if (theme.colorLabels[color]) {
    return theme.colorLabels[color]!;
  }
  return COLOR_INFO[color]?.label || color;
}

/**
 * Get themed display data for a card based on its ID and category.
 * Returns the themed label, description, and icon to override the defaults.
 */
export function getThemedCardDisplay(card: {
  id: string;
  category: string;
  name: string;
  value: number;
  label?: string;
  description?: string;
  colors: PropertyColor[];
  actionType?: string;
  rentFor?: PropertyColor[];
}, theme: Theme): {
  label: string;
  description: string;
  icon: string;
  valueDisplay: string;
  subtitle: string;
  regionLabel: string;
} {
  // Extract the card ID prefix (everything before the dash-number suffix)
  const idPrefix = card.id.replace(/-\d+$/, '');

  // Check for card-specific overrides
  const overrides = theme.cardOverrides[idPrefix];

  let label = card.label || card.name;
  let description = card.description || '';
  let subtitle = '';
  let regionLabel = '';

  if (overrides) {
    if (overrides.label) label = overrides.label;
    if (overrides.description) description = overrides.description;
  }

  // Money cards
  if (card.category === 'money') {
    label = theme.moneyLabel(card.value);
    description = 'Money';
  }

  // Single-color property cards — look up by card name in theme's cardNames
  if (card.category === 'property' && card.colors.length === 1 && card.colors[0] !== 'multicolor') {
    const color = card.colors[0];
    const namedCard = theme.cardNames[card.name];
    if (namedCard) {
      label = namedCard.label;
      subtitle = namedCard.subtitle || '';
    }
    // Region label from theme
    regionLabel = theme.regionLabels[color] || '';
  }

  // Wildcard properties
  if (card.category === 'property' && card.colors.length > 1) {
    if (!overrides?.label) {
      label = theme.wildcardLabel(card.colors);
    }
    if (!overrides?.description) {
      description = theme.wildcardDescription(card.colors);
    }
  }

  // Rent cards
  if (card.category === 'rent') {
    const isWild = !card.rentFor || card.rentFor.length === 0;
    if (!overrides?.description) {
      description = theme.rentDescription(card.rentFor || [], isWild);
    }
  }

  // Determine icon
  let icon = '';
  if (card.category === 'money') {
    icon = '💰';
  } else if (card.category === 'rent') {
    icon = theme.rentIcon;
  } else if (card.category === 'action' && card.actionType) {
    icon = theme.actionIcons[card.actionType] || '⚡';
  } else if (card.category === 'property') {
    if (card.colors.length === 1) {
      icon = theme.propertyIcons[card.colors[0]] || theme.propertyIcon;
    } else if (card.colors.length > 1) {
      // Wildcard — no specific icon, uses label
      icon = '';
    }
  }

  // Value display
  let valueDisplay = '';
  if (card.value > 0) {
    valueDisplay = `${theme.currencyPrefix}${card.value}${theme.currencySuffix}`;
  }

  return { label, description, icon, valueDisplay, subtitle, regionLabel };
}
