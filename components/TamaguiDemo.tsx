import { Button } from '@tamagui/button';
import { Card } from '@tamagui/card';
import { Stack, styled } from '@tamagui/core';
import { Heart, Plus, Star } from '@tamagui/lucide-icons';
import { Separator } from '@tamagui/separator';
import { H2, Paragraph } from '@tamagui/text';
import React from 'react';

// Create XStack and YStack from Stack
export const XStack = styled(Stack, {
  flexDirection: 'row',
});

export const YStack = styled(Stack, {
  flexDirection: 'column',
});

export default function TamaguiDemo() {
  return (
    <YStack space="$4" padding="$4">
      <Card padded elevate backgroundColor="$background">
        <H2>Welcome to Tamagui!</H2>
        <Paragraph>
          Tamagui is now integrated into your React Native app. Here are some components in action:
        </Paragraph>
        <Separator marginVertical="$2" />
        <XStack space="$2" marginTop="$3">
          <Button icon={Plus} theme="active">
            Add Item
          </Button>
          <Button icon={Star} variant="outlined">
            Favorite
          </Button>
          <Button icon={Heart} chromeless>
            Like
          </Button>
        </XStack>
      </Card>
      
      <Card padded>
        <H2>Sample Card</H2>
        <Paragraph>
          This is another card demonstrating Tamagui&apos;s styling capabilities.
        </Paragraph>
        <YStack space="$2" marginTop="$3">
          <Button>Primary Button</Button>
          <Button variant="outlined">Secondary Button</Button>
        </YStack>
      </Card>
    </YStack>
  );
}
