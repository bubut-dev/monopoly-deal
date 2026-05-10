import { Theme } from './types';
import { PropertyColor } from '../types';

export const baliTheme: Theme = {
  id: 'bali',
  name: 'Bali',
  emoji: '🏝️',
  subtitle: 'Island of the Gods',
  currencyPrefix: 'Rp',
  currencySuffix: 'M',
  colorLabels: {
    railroad: 'Clubs',
    utility: 'Sports',
  },
  regionLabels: {
    brown: 'BALI',
    lightblue: 'DENPASAR',
    pink: 'SIDEMEN',
    orange: 'UBUD',
    red: 'CANGGU',
    yellow: 'PERERENAN',
    green: 'SEMINYAK',
    darkblue: 'ULUWATU',
    railroad: 'CLUBS',
    utility: 'SPORTS',
  },
  propertyIcon: '🌴',
  propertyIcons: {
    brown: '🍚',
    lightblue: '🛵',
    pink: '🪷',
    orange: '🧘',
    red: '💻',
    yellow: '🏄',
    green: '🍹',
    darkblue: '🌊',
    railroad: '🎉',
    utility: '🏄',
    multicolor: '🌺',
  },
  rentIcon: '💸',
  actionIcons: {
    dealbreaker: '🌋',
    passgo: '🏍️',
    forceddeal: '🤝',
    slydeal: '🤏',
    debtcollector: '🛂',
    itsmybirthday: '🌕',
    doubletherent: '☀️',
    house: '🏘️',
    hotel: '🏨',
    justsayno: '🛑',
  },
  cardOverrides: {
    // === ACTION CARDS ===
    'a-db': { label: 'Deal\nBreaker', description: 'Volcano Eruption — Steal a full property set' },
    'a-jsn': { label: 'Just Say\nNo!', description: 'Tidak! — Block an action (Rp4M to bank)' },
    'a-pg': { label: 'Pass\nGo', description: 'Miss Traffic Jam — Skip the chaos, draw 2' },
    'a-fd': { label: 'Forced\nDeal', description: 'Bargain Hard — Swap a property with an opponent' },
    'a-sd': { label: 'Sly\nDeal', description: 'Pickpocket — Steal one property card' },
    'a-dc': { label: 'Debt\nCollector', description: 'Customs Fee — Collect Rp5M from a player' },
    'a-bd': { label: "It's My\nBirthday!", description: 'Full Moon Party — Collect Rp10M from all players' },
    'a-dtr': { label: 'Double\nthe Rent', description: 'High Season — Double your next rent charge' },
    'a-house': { label: 'Villa', description: 'Villa — Add to a complete set: +Rp3M rent' },
    'a-hotel': { label: 'Resort', description: 'Resort — Add to set with villa: +Rp4M more rent' },

    // === WILDCARD CARDS ===
    'w-blb': { name: 'Warung & Market', label: 'W&M', description: 'Warung & Market Combo' },
    'w-lbp': { name: 'Market & Temple', label: 'M&T', description: 'Market & Temple Run' },
    'w-po': { name: 'Temple & Yoga', label: 'T&Y', description: 'Temple & Yoga Flow' },
    'w-or': { name: 'Yoga & Nomad', label: 'Y&N', description: 'Yoga & Nomad Life' },
    'w-ry': { name: 'Nomad & Beach', label: 'N&B', description: 'Nomad & Beach Vibes' },
    'w-yg': { name: 'Beach & Party', label: 'B&P', description: 'Beach & Party Crossover' },
    'w-gdb': { name: 'Party & Luxury', label: 'P&L', description: 'Party & Luxury Access' },
    'w-dbrr': { name: 'VIP Club Pass', label: 'VIP', description: 'VIP Club Pass' },
    'w-rru': { name: 'Club & Surf', label: 'C&S', description: 'Club & Surf Bundle' },
    'w-ub': { name: 'Sport & Warung', label: 'S&W', description: 'Sport & Warung' },
    'w-multi': { name: 'Bali Golden Visa', label: 'Bali\nVisa', description: 'Any Set — Bali Golden Visa' },

    // === RENT CARDS ===
    'r-dbg': { label: 'Uluwatu &\nSeminyak', description: 'Uluwatu & Seminyak Rent' },
    'r-dbg2': { label: 'Uluwatu &\nSeminyak', description: 'Uluwatu & Seminyak Rent' },
    'r-ry': { label: 'Canggu &\nPererenan', description: 'Canggu & Pererenan Rent' },
    'r-ry2': { label: 'Canggu &\nPererenan', description: 'Canggu & Pererenan Rent' },
    'r-po': { label: 'Sidemen &\nUbud', description: 'Sidemen & Ubud Rent' },
    'r-po2': { label: 'Sidemen &\nUbud', description: 'Sidemen & Ubud Rent' },
    'r-lbb': { label: 'Denpasar &\nBali', description: 'Denpasar & Bali Rent' },
    'r-lbb2': { label: 'Denpasar &\nBali', description: 'Denpasar & Bali Rent' },
    'r-rru': { label: 'Club &\nSport', description: 'Club & Sport Rent' },
    'r-rru2': { label: 'Club &\nSport', description: 'Club & Sport Rent' },
    'r-wild': { label: 'Island\nRent', description: 'Island-Wide Rent' },
  },
  cardNames: {
    // === Brown (Bali - Cheapest) ===
    'Mediterranean Ave': { label: 'Warung Babi\nGuling', subtitle: 'Balinese Grandma' },
    'Baltic Ave': { label: 'Tegallalang\nRice Terrace', subtitle: 'Farmer Made' },

    // === Light Blue (Denpasar Budget) ===
    'Oriental Ave': { label: 'Pasar\nBadung', subtitle: 'Local' },
    'Vermont Ave': { label: 'Scooter\nRental', subtitle: 'Backpacker' },
    'Connecticut Ave': { label: 'Cheap\nHomestay', subtitle: 'Gap Year Kid' },

    // === Pink (Sidemen Hippie) ===
    'St. Charles Place': { label: 'Sunset\nSpot', subtitle: 'Hippie' },
    'States Ave': { label: 'Temple\nGate', subtitle: 'Temple Tourist' },
    'Virginia Ave': { label: 'Coffee\nPlantation', subtitle: 'Coffee Snob' },

    // === Orange (Ubud Spiritual) ===
    'St. James Place': { label: 'Yoga\nStudio', subtitle: 'Yoga Girl' },
    'Tennessee Ave': { label: 'Monkey\nForest', subtitle: 'Tourist w/ Banana' },
    'New York Ave': { label: 'Organic\nCafé', subtitle: 'Smoothie Bowl Person' },

    // === Red (Canggu Nomad) ===
    'Kentucky Ave': { label: 'Dojo\nCo-Working', subtitle: 'Digital Nomad' },
    'Indiana Ave': { label: 'Echo\nBeach', subtitle: 'Surfer Dude' },
    'Illinois Ave': { label: 'Crypto\nExchange', subtitle: 'Crypto Bro' },

    // === Yellow (Pererenan Trendy) ===
    'Atlantic Ave': { label: 'Beach\nClub', subtitle: 'Instagram Model' },
    'Ventnor Ave': { label: 'Infinity\nPool', subtitle: 'Influencer' },
    'Marvin Gardens': { label: 'Matcha\nCafé', subtitle: 'Wellness Bro' },

    // === Green (Seminyak Party) ===
    'Pacific Ave': { label: 'Potato\nHead', subtitle: 'Party Animal' },
    'North Carolina Ave': { label: 'Motel\nMexicola', subtitle: 'Tequila Girl' },
    'Pennsylvania Ave': { label: 'Ku De Ta', subtitle: 'Fancy Tourist' },

    // === Dark Blue (Uluwatu Luxury) ===
    'Park Place': { label: 'Single\nFin', subtitle: 'Pro Surfer' },
    'Boardwalk': { label: 'Bulgari\nResort', subtitle: 'Russian Billionaire' },

    // === Railroad → Clubs ===
    'Reading Railroad': { label: 'Finns\nBeach Club', subtitle: '' },
    'Pennsylvania Railroad': { label: 'Savaya', subtitle: '' },
    'B&O Railroad': { label: 'Shishi', subtitle: '' },
    'Short Line': { label: 'Atlas\nBeach Fest', subtitle: '' },

    // === Utility → Sports ===
    'Electric Company': { label: 'Surfing', subtitle: '' },
    'Water Works': { label: 'Yoga', subtitle: '' },
  },
  moneyLabel: (value: number) => `Rp${value}M`,
  wildcardLabel: (colors: PropertyColor[]) => {
    if (colors.length > 2 || (colors.length === 1 && colors[0] === 'multicolor')) return 'Bali\nVisa';
    const colorInfo: Record<string, string> = {
      brown: 'Wrg',
      lightblue: 'Mkt',
      pink: 'Tmp',
      orange: 'Yog',
      red: 'Nom',
      yellow: 'Bch',
      green: 'Pty',
      darkblue: 'Lux',
      railroad: 'Clb',
      utility: 'Spt',
    };
    return colors.map(c => colorInfo[c] || c).join('&');
  },
  wildcardDescription: (colors: PropertyColor[]) => {
    if (colors.length > 2 || (colors.length === 1 && colors[0] === 'multicolor')) return 'Any Set — Bali Golden Visa';
    const pairs: Record<string, string> = {
      'brown,lightblue': 'Warung & Market Combo',
      'lightblue,pink': 'Market & Temple Run',
      'pink,orange': 'Temple & Yoga Flow',
      'orange,red': 'Yoga & Nomad Life',
      'red,yellow': 'Nomad & Beach Vibes',
      'yellow,green': 'Beach & Party Crossover',
      'green,darkblue': 'Party & Luxury Access',
      'darkblue,railroad': 'VIP Club Pass',
      'railroad,utility': 'Club & Surf Bundle',
      'utility,brown': 'Sport & Warung',
    };
    const key = colors.join(',');
    return pairs[key] || 'Wildcard Property';
  },
  rentDescription: (rentFor: PropertyColor[], isWild: boolean) => {
    if (isWild) return 'Island-Wide Rent';
    const colorNames: Record<string, string> = {
      brown: 'Bali',
      lightblue: 'Denpasar',
      pink: 'Sidemen',
      orange: 'Ubud',
      red: 'Canggu',
      yellow: 'Pererenan',
      green: 'Seminyak',
      darkblue: 'Uluwatu',
      railroad: 'Club',
      utility: 'Sport',
    };
    return `${rentFor.map(c => colorNames[c] || c).join(' & ')} Rent`;
  },
  cardBackLabel: 'BALI DEAL',
};
