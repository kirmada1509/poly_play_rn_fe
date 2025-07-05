import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const BOARD_SIZE = screenWidth - 40;

export default function GameBoardScreen() {
  const [diceValue, setDiceValue] = useState(1);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('Rolling Dice...');

  const handleRollDice = () => {
    if (!isMyTurn) {
      Alert.alert('Wait', 'It\'s not your turn yet!');
      return;
    }

    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);
    setGameStatus(`You rolled ${newValue}!`);
    
    // Simulate turn change
    setTimeout(() => {
      setIsMyTurn(false);
      setGameStatus('Waiting for other players...');
      
      // Simulate next turn after 3 seconds
      setTimeout(() => {
        setIsMyTurn(true);
        setGameStatus('Your turn - Roll the dice!');
      }, 3000);
    }, 1500);
  };

  const handleLeaveGame = () => {
    Alert.alert(
      'Leave Game',
      'Are you sure you want to leave the game?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const renderDice = () => {
    const getDotPositions = (value: number) => {
      const positions: { top: number; left: number }[] = [];
      const size = 60;
      
      switch (value) {
        case 1:
          positions.push({ top: size * 0.5 - 3, left: size * 0.5 - 3 });
          break;
        case 2:
          positions.push({ top: size * 0.25, left: size * 0.25 });
          positions.push({ top: size * 0.75 - 6, left: size * 0.75 - 6 });
          break;
        case 3:
          positions.push({ top: size * 0.25, left: size * 0.25 });
          positions.push({ top: size * 0.5 - 3, left: size * 0.5 - 3 });
          positions.push({ top: size * 0.75 - 6, left: size * 0.75 - 6 });
          break;
        case 4:
          positions.push({ top: size * 0.25, left: size * 0.25 });
          positions.push({ top: size * 0.25, left: size * 0.75 - 6 });
          positions.push({ top: size * 0.75 - 6, left: size * 0.25 });
          positions.push({ top: size * 0.75 - 6, left: size * 0.75 - 6 });
          break;
        case 5:
          positions.push({ top: size * 0.2, left: size * 0.2 });
          positions.push({ top: size * 0.2, left: size * 0.8 - 6 });
          positions.push({ top: size * 0.5 - 3, left: size * 0.5 - 3 });
          positions.push({ top: size * 0.8 - 6, left: size * 0.2 });
          positions.push({ top: size * 0.8 - 6, left: size * 0.8 - 6 });
          break;
        case 6:
          positions.push({ top: size * 0.2, left: size * 0.25 });
          positions.push({ top: size * 0.2, left: size * 0.75 - 6 });
          positions.push({ top: size * 0.5 - 3, left: size * 0.25 });
          positions.push({ top: size * 0.5 - 3, left: size * 0.75 - 6 });
          positions.push({ top: size * 0.8 - 6, left: size * 0.25 });
          positions.push({ top: size * 0.8 - 6, left: size * 0.75 - 6 });
          break;
      }
      
      return positions;
    };

    return (
      <TouchableOpacity
        style={styles.dice}
        onPress={handleRollDice}
        disabled={!isMyTurn}
      >
        {getDotPositions(diceValue).map((position, index) => (
          <View
            key={index}
            style={[styles.dot, { top: position.top, left: position.left }]}
          />
        ))}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ludo Game</Text>
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={handleLeaveGame}
        >
          <Text style={styles.leaveButtonText}>Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.board}>
          <Text style={styles.boardPlaceholder}>Game Board</Text>
          <Text style={styles.boardSubtext}>
            Visual game board will be implemented here
          </Text>
        </View>

        <View style={styles.controlArea}>
          <Text style={styles.gameStatus}>{gameStatus}</Text>
          
          <View style={styles.diceArea}>
            <Text style={styles.diceLabel}>Dice</Text>
            {renderDice()}
            <Text style={styles.diceInstructions}>
              {isMyTurn ? 'Tap to roll!' : 'Wait for your turn'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7cd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f97316',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  leaveButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  leaveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  boardPlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  boardSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  controlArea: {
    alignItems: 'center',
  },
  gameStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  diceArea: {
    alignItems: 'center',
  },
  diceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  dice: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    position: 'relative',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1f2937',
    position: 'absolute',
  },
  diceInstructions: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
