/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable dark mode using class strategy
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ludo: {
          // Player colors (unchanged - pastel colors still work on dark background if contrast is good)
          red: {
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

          board: {
            light: '#fdfcf7',
            dark: '#c4b5a0',
            path: '#ffffff',
            safe: '#f0fdf4',
            home: '#fef9f3',
            center: '#fffef0',
          },

          background: {
            primary: '#fefefe',
            secondary: '#faf9f7',
            card: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.3)',

            // Dark mode overrides
            darkPrimary: '#1a1a1a',
            darkSecondary: '#2a2a2a',
            darkCard: '#252525',
            darkOverlay: 'rgba(255, 255, 255, 0.05)',
          },

          text: {
            primary: '#4a5568',
            secondary: '#718096',
            muted: '#a0aec0',
            inverse: '#ffffff',

            // Dark mode
            darkPrimary: '#e2e8f0',
            darkSecondary: '#cbd5e1',
            darkMuted: '#94a3b8',
          },

          accent: {
            gold: '#f7d794',
            silver: '#e2e8f0',
            bronze: '#d4a574',
            success: '#81e6a3',
            warning: '#f5d76e',
            error: '#ed6b6b',
            info: '#7bb3f0',
          },

          border: {
            light: '#f1f5f9',
            medium: '#e2e8f0',
            dark: '#cbd5e1',

            // Dark mode
            darkLight: '#475569',
            darkMedium: '#334155',
            darkDark: '#1e293b',
          },

          shadow: {
            light: 'rgba(0, 0, 0, 0.03)',
            medium: 'rgba(0, 0, 0, 0.06)',
            dark: 'rgba(0, 0, 0, 0.12)',

            // Dark mode
            darkLight: 'rgba(255, 255, 255, 0.03)',
            darkMedium: 'rgba(255, 255, 255, 0.06)',
            darkDark: 'rgba(255, 255, 255, 0.12)',
          }
        }
      },
      fontFamily: {
        'game': ['SpaceMono-Regular'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'game': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'piece': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'game-dark': '0 4px 12px rgba(255, 255, 255, 0.1)',
        'piece-dark': '0 2px 8px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
