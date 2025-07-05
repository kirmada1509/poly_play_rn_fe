import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import stores and services
import { useAuthStore } from 'ludo/src/store';
import { logger } from 'ludo/src/services/logger';

// Import screens
import { GameBoardScreen } from '@/screens/GameBoardScreen';

// Import components
import { Button } from 'ludo/src/components/Button';

// Mock Login Screen for demonstration
const LoginScreen: React.FC = () => {
  const { login, signup, isLoading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login('demo@polyplay.com', 'password123');
    } catch (error) {
      logger.error('Login failed', error, 'App');
    }
  };

  const handleSignup = async () => {
    try {
      await signup('demo@polyplay.com', 'demouser', 'password123');
    } catch (error) {
      logger.error('Signup failed', error, 'App');
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>PolyPlay</Text>
      <Text style={styles.subtitle}>Multiplayer Ludo with Real Stakes</Text>
      
      <View style={styles.authButtons}>
        <Button
          title="Demo Login"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
        />
        <Button
          title="Demo Signup"
          onPress={handleSignup}
          loading={isLoading}
          variant="outline"
          fullWidth
        />
      </View>
      
      <Text style={styles.demoNote}>
        This is a demo version. Use demo credentials or create a test account.
      </Text>
    </View>
  );
};

// Main App Component
export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    logger.info('PolyPlay app started', { version: '1.0.0' }, 'App');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#fef7cd" />
      
      <View style={styles.container}>
        {isAuthenticated && user ? (
          <GameBoardScreen />
        ) : (
          <LoginScreen />
        )}
      </View>
      
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7cd',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fef7cd',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#f97316',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#92400e',
    marginBottom: 48,
    textAlign: 'center',
    fontWeight: '500',
  },
  authButtons: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  demoNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
