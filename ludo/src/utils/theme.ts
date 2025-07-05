// Theme configuration for PolyPlay
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    
    // Game-specific colors
    ludo: {
      red: string;
      green: string;
      blue: string;
      yellow: string;
    };
    
    // Board colors
    board: {
      background: string;
      border: string;
      safe: string;
      start: string;
      home: string;
    };
  };
  
  typography: {
    fontFamily: string;
    fontFamilyBold: string;
    sizes: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
    weights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    full: number;
  };
  
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

// Arcade theme - bold and colorful
export const arcadeTheme: Theme = {
  colors: {
    primary: '#f97316', // Orange
    secondary: '#0ea5e9', // Blue
    success: '#22c55e', // Green
    danger: '#ef4444', // Red
    warning: '#f59e0b', // Yellow
    background: '#fef7cd', // Light yellow background
    surface: '#ffffff',
    text: '#92400e', // Dark brown
    textSecondary: '#6b7280', // Gray
    border: '#92400e',
    shadow: '#000000',
    
    ludo: {
      red: '#ef4444',
      green: '#22c55e',
      blue: '#3b82f6',
      yellow: '#f59e0b',
    },
    
    board: {
      background: '#fef7cd',
      border: '#92400e',
      safe: '#dcfce7',
      start: '#fee2e2',
      home: '#f3e8ff',
    },
  },
  
  typography: {
    fontFamily: 'System',
    fontFamilyBold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

// Classic Ludo theme - traditional colors
export const classicTheme: Theme = {
  ...arcadeTheme,
  colors: {
    ...arcadeTheme.colors,
    primary: '#dc2626', // Traditional red
    secondary: '#1d4ed8', // Traditional blue
    background: '#f9fafb', // Light gray background
    surface: '#ffffff',
    text: '#1f2937', // Dark gray
    border: '#d1d5db',
    
    board: {
      background: '#f9fafb',
      border: '#374151',
      safe: '#fef3c7',
      start: '#fee2e2',
      home: '#ecfdf5',
    },
  },
};

// Current theme - can be switched dynamically
export let currentTheme: Theme = arcadeTheme;

export const setTheme = (theme: Theme) => {
  currentTheme = theme;
};

export const getTheme = (): Theme => currentTheme;
