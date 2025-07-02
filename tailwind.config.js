/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Pastel Ludo colors - Soft, dreamy, and gentle
        ludo: {
          // Player colors - Pastel versions
          red: {
            50: '#fef7f7',
            100: '#fdeaea',
            200: '#fbd5d5',
            300: '#f8b5b5',
            400: '#f48a8a',
            500: '#ed6b6b', // Primary pastel red
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
            500: '#7bb3f0', // Primary pastel blue
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
            500: '#88d8a3', // Primary pastel green
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
            500: '#f5d76e', // Primary pastel yellow
            600: '#e8c547',
            700: '#d4a728',
            800: '#b5841e',
            900: '#946b1c',
          },
          
          // Board colors - Soft pastels
          board: {
            light: '#fdfcf7', // Very light cream
            dark: '#c4b5a0',  // Soft brown for edges
            path: '#ffffff',  // Pure white for path
            safe: '#f0fdf4',  // Very light green for safe zones
            home: '#fef9f3',  // Very light peach for home areas
            center: '#fffef0', // Very light yellow for center
          },
          
          // UI colors - Dreamy pastels
          background: {
            primary: '#fefefe',   // Almost white with warmth
            secondary: '#faf9f7', // Very light warm gray
            card: '#ffffff',     // Pure white for cards
            overlay: 'rgba(0, 0, 0, 0.3)', // Lighter overlay
          },
          
          text: {
            primary: '#4a5568',   // Soft dark gray
            secondary: '#718096', // Medium soft gray
            muted: '#a0aec0',     // Light soft gray
            inverse: '#ffffff',   // White text
          },
          
          // Accent colors - Gentle pastels
          accent: {
            gold: '#f7d794',      // Pastel gold
            silver: '#e2e8f0',    // Soft silver
            bronze: '#d4a574',    // Pastel bronze
            success: '#81e6a3',   // Pastel success green
            warning: '#f5d76e',   // Pastel warning yellow
            error: '#ed6b6b',     // Pastel error red
            info: '#7bb3f0',      // Pastel info blue
          },
          
          // Border colors - Subtle pastels
          border: {
            light: '#f1f5f9',
            medium: '#e2e8f0',
            dark: '#cbd5e1',
          },
          
          // Shadow colors - Very soft
          shadow: {
            light: 'rgba(0, 0, 0, 0.03)',
            medium: 'rgba(0, 0, 0, 0.06)',
            dark: 'rgba(0, 0, 0, 0.12)',
          }
        }
      },
      fontFamily: {
        'game': ['SpaceMono-Regular'], // Using the existing font
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
      }
    },
  },
  plugins: [],
}
