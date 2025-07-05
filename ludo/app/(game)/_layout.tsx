import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="board" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal'
        }} 
      />
    </Stack>
  );
}
