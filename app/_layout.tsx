import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#fefefe" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fefefe',
          },
          headerTintColor: '#4a5568',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: "Pastel Poly Play",
            headerStyle: {
              backgroundColor: '#ffffff',
            }
          }} 
        />
      </Stack>
    </>
  );
}
