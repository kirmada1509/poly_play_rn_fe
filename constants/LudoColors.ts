/**
 * Pastel Ludo-inspired color scheme for Poly Play
 * These soft, dreamy colors provide a gentle and calming aesthetic
 * while maintaining the classic Ludo game identity.
 */

export const LudoColors = {
  // Player Colors - Soft pastel versions
  players: {
    red: {
      primary: '#ed6b6b',
      light: '#f8b5b5',
      dark: '#e04e4e',
      50: '#fef7f7',
      100: '#fdeaea',
      200: '#fbd5d5',
      300: '#f8b5b5',
      400: '#f48a8a',
      500: '#ed6b6b',
      600: '#e04e4e',
      700: '#c73e3e',
      800: '#a53333',
      900: '#872c2c',
    },
    blue: {
      primary: '#7bb3f0',
      light: '#87c9fc',
      dark: '#5b9bd5',
      50: '#f0f8ff',
      100: '#e0f0fe',
      200: '#bae0fd',
      300: '#87c9fc',
      400: '#4eadf8',
      500: '#7bb3f0',
      600: '#5b9bd5',
      700: '#4a7fb8',
      800: '#3d6596',
      900: '#355478',
    },
    green: {
      primary: '#88d8a3',
      light: '#a0ecb8',
      dark: '#65c785',
      50: '#f3fdf7',
      100: '#e3fbec',
      200: '#c9f6d9',
      300: '#a0ecb8',
      400: '#6ddd91',
      500: '#88d8a3',
      600: '#65c785',
      700: '#4ea86c',
      800: '#408758',
      900: '#366f4a',
    },
    yellow: {
      primary: '#f5d76e',
      light: '#ffec85',
      dark: '#e8c547',
      50: '#fffef0',
      100: '#fffbdc',
      200: '#fff5b8',
      300: '#ffec85',
      400: '#ffdf51',
      500: '#f5d76e',
      600: '#e8c547',
      700: '#d4a728',
      800: '#b5841e',
      900: '#946b1c',
    },
  },

  // Board Elements - Soft and dreamy
  board: {
    background: '#fdfcf7',
    path: '#ffffff',
    safe: '#f0fdf4',
    home: '#fef9f3',
    center: '#fffef0',
    border: '#c4b5a0',
  },

  // Background Colors - Clean and minimal
  background: {
    primary: '#fefefe',
    secondary: '#faf9f7',
    card: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.3)',
  },

  // Text Colors - Soft and readable
  text: {
    primary: '#4a5568',
    secondary: '#718096',
    muted: '#a0aec0',
    inverse: '#ffffff',
  },

  // Accent Colors - Gentle pastels
  accent: {
    gold: '#f7d794',
    silver: '#e2e8f0',
    bronze: '#d4a574',
    success: '#81e6a3',
    warning: '#f5d76e',
    error: '#ed6b6b',
    info: '#7bb3f0',
  },

  // Border Colors - Subtle and soft
  border: {
    light: '#f1f5f9',
    medium: '#e2e8f0',
    dark: '#cbd5e1',
  },

  // Shadow Colors - Very gentle
  shadow: {
    light: 'rgba(0, 0, 0, 0.03)',
    medium: 'rgba(0, 0, 0, 0.06)',
    dark: 'rgba(0, 0, 0, 0.12)',
  },
} as const;

/**
 * Get player color by index (0-3)
 */
export const getPlayerColor = (playerIndex: number) => {
  const colors = ['red', 'blue', 'green', 'yellow'] as const;
  return LudoColors.players[colors[playerIndex % 4]];
};

/**
 * Color utilities for consistent theming
 */
export const ColorUtils = {
  /**
   * Get contrasting text color for a given background
   */
  getContrastText: (backgroundColor: string): string => {
    // Simple contrast calculation - in a real app you might want more sophisticated logic
    const darkBackgrounds = [
      LudoColors.players.red[700],
      LudoColors.players.blue[700],
      LudoColors.players.green[700],
      LudoColors.board.border,
      LudoColors.text.primary,
    ];
    
    return (darkBackgrounds as string[]).includes(backgroundColor) 
      ? LudoColors.text.inverse 
      : LudoColors.text.primary;
  },

  /**
   * Get player color class names for NativeWind
   */
  getPlayerClasses: (playerIndex: number) => {
    const colors = ['red', 'blue', 'green', 'yellow'] as const;
    const color = colors[playerIndex % 4];
    return {
      bg: `bg-ludo-${color}-500`,
      bgLight: `bg-ludo-${color}-100`,
      bgDark: `bg-ludo-${color}-700`,
      text: `text-ludo-${color}-500`,
      border: `border-ludo-${color}-500`,
    };
  },
};

/**
 * Game state colors for different UI states
 */
export const GameStateColors = {
  waiting: LudoColors.text.muted,
  active: LudoColors.accent.success,
  winner: LudoColors.accent.gold,
  turn: LudoColors.accent.info,
  eliminated: LudoColors.text.muted,
};

export default LudoColors;
