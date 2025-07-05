import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { router } from 'expo-router';

export default function Index() {
  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>PolyPlay</Text>
        <Text style={styles.subtitle}>Multiplayer Ludo Game</Text>
        <Text style={styles.description}>
          Challenge friends and players from around the world in this classic board game!
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7cd',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
