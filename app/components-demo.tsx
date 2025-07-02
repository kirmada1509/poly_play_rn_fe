import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
    Dice,
    GameBoardCell,
    GamePiece,
    GameStatusBar,
    PlayerCard
} from '../components/LudoGameComponents';

export default function ComponentShowcase() {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      setIsRolling(false);
    }, 1000);
  };

  const nextPlayer = () => {
    setCurrentPlayer((prev) => (prev + 1) % 4);
  };

  return (
    <ScrollView className="flex-1 bg-ludo-background-primary">
      {/* Header */}
      <View className="px-6 py-8 bg-ludo-background-card shadow-lg">
        <Text className="text-3xl font-bold text-ludo-text-primary text-center">
          � Pastel Game Components
        </Text>
        <Text className="text-lg text-ludo-text-secondary text-center mt-2">
          Interactive Dreamy Ludo Elements
        </Text>
      </View>

      {/* Game Status */}
      <View className="p-6">
        <Text className="text-xl font-bold text-ludo-text-primary mb-4">
          📊 Game Status
        </Text>
        <GameStatusBar 
          currentPlayer={currentPlayer} 
          gamePhase="playing" 
        />
        <Pressable onPress={nextPlayer} className="mt-3">
          <View className="bg-ludo-accent-info p-3 rounded-lg">
            <Text className="text-white text-center font-bold">
              Next Player&apos;s Turn
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Dice Section */}
      <View className="p-6">
        <Text className="text-xl font-bold text-ludo-text-primary mb-4">
          🎲 Interactive Dice
        </Text>
        <View className="flex-row items-center justify-center space-x-4">
          <Dice 
            value={diceValue} 
            isRolling={isRolling} 
            onRoll={rollDice}
          />
          <View>
            <Text className="text-ludo-text-primary font-bold">
              Value: {diceValue}
            </Text>
            <Text className="text-ludo-text-secondary">
              {isRolling ? 'Rolling...' : 'Tap to roll'}
            </Text>
          </View>
        </View>
      </View>

      {/* Game Pieces */}
      <View className="p-6">
        <Text className="text-xl font-bold text-ludo-text-primary mb-4">
          🔴 Game Pieces
        </Text>
        <View className="flex-row space-x-4 justify-center">
          {[0, 1, 2, 3].map((playerIndex) => (
            <View key={playerIndex} className="items-center">
              <GamePiece 
                playerIndex={playerIndex}
                isSelected={selectedPiece === playerIndex}
                onPress={() => setSelectedPiece(
                  selectedPiece === playerIndex ? null : playerIndex
                )}
              />
              <Text className="text-ludo-text-secondary text-xs mt-1">
                {['Red', 'Blue', 'Green', 'Yellow'][playerIndex]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Player Cards */}
      <View className="p-6">
        <Text className="text-xl font-bold text-ludo-text-primary mb-4">
          👥 Player Cards
        </Text>
        <View className="space-y-3">
          {[
            { name: 'Red Player', score: 25 },
            { name: 'Blue Player', score: 18 },
            { name: 'Green Player', score: 31 },
            { name: 'Yellow Player', score: 12 }
          ].map((player, index) => (
            <PlayerCard
              key={index}
              playerIndex={index}
              playerName={player.name}
              isCurrentTurn={index === currentPlayer}
              score={player.score}
            />
          ))}
        </View>
      </View>

      {/* Board Cells */}
      <View className="p-6">
        <Text className="text-xl font-bold text-ludo-text-primary mb-4">
          🎯 Board Cells
        </Text>
        <View className="space-y-4">
          <View>
            <Text className="text-ludo-text-secondary mb-2">Normal Path</Text>
            <View className="flex-row space-x-1">
              {[0, 1, 2, 3, 4].map((_, index) => (
                <GameBoardCell 
                  key={index}
                  type="normal" 
                  hasPiece={index === 2}
                  playerIndex={index === 2 ? 0 : undefined}
                />
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-ludo-text-secondary mb-2">Safe Zones</Text>
            <View className="flex-row space-x-1">
              {[0, 1, 2].map((_, index) => (
                <GameBoardCell 
                  key={index}
                  type="safe" 
                />
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-ludo-text-secondary mb-2">Home Areas</Text>
            <View className="flex-row space-x-1">
              {[0, 1, 2, 3].map((playerIndex) => (
                <GameBoardCell 
                  key={playerIndex}
                  type="home" 
                  playerIndex={playerIndex}
                  hasPiece={playerIndex < 2}
                />
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-ludo-text-secondary mb-2">Start Positions</Text>
            <View className="flex-row space-x-1">
              {[0, 1, 2, 3].map((playerIndex) => (
                <GameBoardCell 
                  key={playerIndex}
                  type="start" 
                  playerIndex={playerIndex}
                />
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-ludo-text-secondary mb-2">Center Victory</Text>
            <View className="items-center">
              <GameBoardCell type="center" />
            </View>
          </View>
        </View>
      </View>

      {/* Color Swatches */}
      <View className="p-6">
        <Text className="text-xl font-bold text-ludo-text-primary mb-4">
          🎨 Quick Color Reference
        </Text>
        <View className="space-y-3">
          <View>
            <Text className="text-ludo-text-secondary mb-2">Player Colors</Text>
            <View className="flex-row space-x-2">
              <View className="bg-ludo-red-500 w-8 h-8 rounded" />
              <View className="bg-ludo-blue-500 w-8 h-8 rounded" />
              <View className="bg-ludo-green-500 w-8 h-8 rounded" />
              <View className="bg-ludo-yellow-500 w-8 h-8 rounded" />
            </View>
          </View>
          
          <View>
            <Text className="text-ludo-text-secondary mb-2">Board Elements</Text>
            <View className="flex-row space-x-2">
              <View className="bg-ludo-board-light w-8 h-8 rounded border border-ludo-border-light" />
              <View className="bg-ludo-board-safe w-8 h-8 rounded border border-ludo-border-light" />
              <View className="bg-ludo-board-home w-8 h-8 rounded border border-ludo-border-light" />
              <View className="bg-ludo-board-center w-8 h-8 rounded border border-ludo-border-light" />
            </View>
          </View>
          
          <View>
            <Text className="text-ludo-text-secondary mb-2">Accent Colors</Text>
            <View className="flex-row space-x-2">
              <View className="bg-ludo-accent-gold w-8 h-8 rounded" />
              <View className="bg-ludo-accent-success w-8 h-8 rounded" />
              <View className="bg-ludo-accent-warning w-8 h-8 rounded" />
              <View className="bg-ludo-accent-error w-8 h-8 rounded" />
              <View className="bg-ludo-accent-info w-8 h-8 rounded" />
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="p-6 bg-ludo-board-border">
        <Text className="text-white text-center">
          � Dreamy components ready for your pastel Ludo game! �
        </Text>
      </View>
    </ScrollView>
  );
}
