# Tamagui Integration Guide

This project now has Tamagui integrated! Tamagui is a modern, performant UI system for React Native and Web.

## 🎉 What's Included

### Core Tamagui Packages
- `@tamagui/core` - Core system with styling and components
- `@tamagui/config` - Default configuration
- `@tamagui/animations-react-native` - Animations support
- `@tamagui/font-inter` - Inter font family
- `@tamagui/theme-base` - Base theme system
- `@tamagui/shorthands` - CSS shorthand properties

### UI Components
- `@tamagui/button` - Button component
- `@tamagui/card` - Card component
- `@tamagui/text` - Text components (H1, H2, Paragraph, etc.)
- `@tamagui/input` - Input component
- `@tamagui/form` - Form components
- `@tamagui/select` - Select/dropdown component
- `@tamagui/avatar` - Avatar component
- `@tamagui/image` - Image component
- `@tamagui/label` - Label component
- `@tamagui/slider` - Slider component
- `@tamagui/switch` - Switch/toggle component
- `@tamagui/progress` - Progress bar component
- `@tamagui/separator` - Separator/divider component
- `@tamagui/sheet` - Sheet/modal component
- `@tamagui/dialog` - Dialog/modal component
- `@tamagui/popover` - Popover component
- `@tamagui/tooltip` - Tooltip component
- `@tamagui/tabs` - Tabs component
- `@tamagui/checkbox` - Checkbox component
- `@tamagui/toast` - Toast notification component
- `@tamagui/lucide-icons` - Icon system

## 🚀 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { Stack, styled } from '@tamagui/core';
import { Button } from '@tamagui/button';
import { Card } from '@tamagui/card';
import { H2, Paragraph } from '@tamagui/text';

// Create layout components
const XStack = styled(Stack, {
  flexDirection: 'row',
});

const YStack = styled(Stack, {
  flexDirection: 'column',
});

export default function MyComponent() {
  return (
    <YStack space="$4" padding="$4">
      <Card padded elevate>
        <H2>Hello Tamagui!</H2>
        <Paragraph>This is a simple card with Tamagui components.</Paragraph>
        <XStack space="$2" marginTop="$3">
          <Button theme="active">Primary</Button>
          <Button variant="outlined">Secondary</Button>
        </XStack>
      </Card>
    </YStack>
  );
}
```

### Using Icons

```tsx
import { Plus, Heart, Star } from '@tamagui/lucide-icons';
import { Button } from '@tamagui/button';

export default function IconButtons() {
  return (
    <>
      <Button icon={Plus}>Add Item</Button>
      <Button icon={Heart} chromeless />
      <Button icon={Star} variant="outlined">Favorite</Button>
    </>
  );
}
```

### Form Components

```tsx
import { Input } from '@tamagui/input';
import { Label } from '@tamagui/label';
import { Button } from '@tamagui/button';
import { YStack } from '@tamagui/stacks';

export default function SimpleForm() {
  return (
    <YStack space="$3" padding="$4">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter your name" />
      
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="Enter your email" />
      
      <Button>Submit</Button>
    </YStack>
  );
}
```

## 🎨 Styling

Tamagui uses a token-based design system. You can use tokens for consistent spacing, colors, and sizing:

```tsx
import { YStack, Text } from '@tamagui/core';

export default function StyledComponent() {
  return (
    <YStack 
      padding="$4"           // Token-based padding
      backgroundColor="$background"  // Theme-aware background
      borderRadius="$3"      // Token-based border radius
      space="$2"            // Space between children
    >
      <Text fontSize="$6" color="$color">
        Styled with tokens!
      </Text>
    </YStack>
  );
}
```

## 🔧 Configuration

The Tamagui configuration is located in `tamagui.config.ts`. This file:

- Sets up the design system tokens
- Configures themes (light/dark mode)
- Defines component variants
- Sets up animations

## 📱 Platform Support

Tamagui works across:
- ✅ React Native (iOS/Android)
- ✅ Expo
- ✅ Web
- ✅ Next.js (when using web)

## 🎯 Features

- **Performance**: Optimized with compile-time optimizations
- **Theming**: Built-in light/dark mode support
- **Animations**: Smooth animations with `@tamagui/animations-react-native`
- **TypeScript**: Full TypeScript support with autocomplete
- **Responsive**: Built-in responsive design support
- **Tree Shaking**: Only import what you use

## 📚 Available Components

Check out the `components/TamaguiDemo.tsx` file for examples of various Tamagui components in action!

## 🔗 Resources

- [Tamagui Documentation](https://tamagui.dev)
- [Component Library](https://tamagui.dev/docs/components/button)
- [Theming Guide](https://tamagui.dev/docs/core/theme)
- [Animation Guide](https://tamagui.dev/docs/core/animations)

## 🐛 Troubleshooting

If you encounter issues:

1. Make sure all Tamagui packages are the same version
2. Clear Metro cache: `npx expo start --clear`
3. Restart the development server
4. Check that `babel.config.js` includes the Tamagui plugin

Happy coding with Tamagui! 🎉
