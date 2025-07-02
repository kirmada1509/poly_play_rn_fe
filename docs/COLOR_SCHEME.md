# � Poly Play Ludo - Pastel Color Scheme Documentation

## Overview
This document outlines the dreamy pastel color scheme designed for the Poly Play Ludo mobile application. The colors provide a soft, calming aesthetic while maintaining the traditional Ludo game identity.

## 🎨 Color Philosophy
- **Dreamy**: Soft pastel colors that create a calming experience
- **Gentle**: Reduced saturation for comfortable extended gameplay
- **Accessible**: Maintains proper contrast ratios despite softer colors
- **Modern**: Contemporary pastel aesthetic with timeless appeal
- **Scalable**: Complete shade system for various UI states

## 🎮 Player Colors

### Pastel Red Player
- **Primary**: `#ed6b6b` (ludo-red-500)
- **Light**: `#f8b5b5` (ludo-red-300)
- **Dark**: `#e04e4e` (ludo-red-600)
- **Usage**: Soft coral-like game pieces and UI elements

### Pastel Blue Player
- **Primary**: `#7bb3f0` (ludo-blue-500)
- **Light**: `#87c9fc` (ludo-blue-300)
- **Dark**: `#5b9bd5` (ludo-blue-600)
- **Usage**: Dreamy sky blue game pieces and UI elements

### Pastel Green Player
- **Primary**: `#88d8a3` (ludo-green-500)
- **Light**: `#a0ecb8` (ludo-green-300)
- **Dark**: `#65c785` (ludo-green-600)
- **Usage**: Soft mint green game pieces and UI elements

### Pastel Yellow Player
- **Primary**: `#f5d76e` (ludo-yellow-500)
- **Light**: `#ffec85` (ludo-yellow-300)
- **Dark**: `#e8c547` (ludo-yellow-600)
- **Usage**: Warm butter yellow game pieces and UI elements

## 🎯 Board Elements

### Board Colors
- **Background**: `#fdfcf7` (ludo-board-light) - Very light cream for main board
- **Path**: `#ffffff` (ludo-board-path) - Pure white for movement track
- **Safe Zones**: `#f0fdf4` (ludo-board-safe) - Very light mint for protected areas
- **Home Areas**: `#fef9f3` (ludo-board-home) - Very light peach for starting positions
- **Center**: `#fffef0` (ludo-board-center) - Very light cream for victory zone
- **Border**: `#c4b5a0` (ludo-board-border) - Soft taupe for board edges

## 🌟 UI Elements

### Background Colors
- **Primary**: `#fefefe` (ludo-background-primary) - Almost pure white
- **Secondary**: `#faf9f7` (ludo-background-secondary) - Very soft warm white
- **Card**: `#ffffff` (ludo-background-card) - Pure white for cards
- **Overlay**: `rgba(0, 0, 0, 0.3)` - Gentle overlay

### Text Colors
- **Primary**: `#4a5568` (ludo-text-primary) - Soft charcoal
- **Secondary**: `#718096` (ludo-text-secondary) - Medium soft gray
- **Muted**: `#a0aec0` (ludo-text-muted) - Light soft gray
- **Inverse**: `#ffffff` (ludo-text-inverse) - White text

### Accent Colors
- **Gold**: `#f7d794` (ludo-accent-gold) - Soft pastel gold
- **Success**: `#81e6a3` (ludo-accent-success) - Gentle mint success
- **Warning**: `#f5d76e` (ludo-accent-warning) - Soft butter warning
- **Error**: `#ed6b6b` (ludo-accent-error) - Gentle coral error
- **Info**: `#7bb3f0` (ludo-accent-info) - Dreamy sky info

## 📱 Implementation

### NativeWind Classes
All colors are available as Tailwind CSS classes with the `ludo-` prefix:

```jsx
// Player colors
<View className="bg-ludo-red-500" />
<Text className="text-ludo-blue-600" />

// Board elements
<View className="bg-ludo-board-light" />
<View className="bg-ludo-board-safe" />

// UI elements
<View className="bg-ludo-background-primary" />
<Text className="text-ludo-text-primary" />
```

### JavaScript Constants
Import the color constants for programmatic use:

```jsx
import { LudoColors, ColorUtils } from './constants/LudoColors';

// Direct color access
const redPrimary = LudoColors.players.red.primary;

// Utility functions
const playerClasses = ColorUtils.getPlayerClasses(0); // Red player
const contrastText = ColorUtils.getContrastText('#ef4444');
```

## 🎪 Component Examples

### Game Pieces
```jsx
<GamePiece playerIndex={0} isSelected={true} />
```

### Player Cards
```jsx
<PlayerCard 
  playerIndex={1} 
  playerName="Blue Player" 
  isCurrentTurn={true} 
  score={15} 
/>
```

### Dice Component
```jsx
<Dice value={6} isRolling={false} onRoll={handleDiceRoll} />
```

### Board Cells
```jsx
<GameBoardCell type="safe" playerIndex={2} hasPiece={true} />
```

## 🔧 Customization

### Adding New Shades
To add new color variations, update the `tailwind.config.js`:

```javascript
colors: {
  ludo: {
    red: {
      // Add new shade
      950: '#450a0a',
    }
  }
}
```

### Theme Variants
Consider creating theme variants for:
- **Dark Mode**: Darker backgrounds, adjusted contrasts
- **High Contrast**: Enhanced accessibility
- **Colorblind Friendly**: Alternative color schemes

## 🎯 Best Practices

1. **Consistency**: Always use the defined color scheme
2. **Contrast**: Ensure proper text contrast ratios
3. **Context**: Use appropriate colors for game states
4. **Accessibility**: Test with colorblind users
5. **Performance**: Use color constants to avoid repeated definitions

## 🎮 Game State Colors

- **Waiting**: `#718096` (muted gray)
- **Active**: `#10b981` (success green)
- **Winner**: `#fbbf24` (gold)
- **Turn**: `#3b82f6` (info blue)
- **Eliminated**: `#718096` (muted gray)

This pastel color scheme provides a soothing foundation for building an engaging, accessible, and visually gentle Ludo game experience that's perfect for relaxed gameplay sessions.
