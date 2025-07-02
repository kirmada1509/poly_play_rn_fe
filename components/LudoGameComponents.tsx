import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ColorUtils } from '../constants/LudoColors';

interface GamePieceProps {
  playerIndex: number;
  isSelected?: boolean;
  onPress?: () => void;
}

export function GamePiece({ playerIndex, isSelected = false, onPress }: GamePieceProps) {
  const playerClasses = ColorUtils.getPlayerClasses(playerIndex);
  
  return (
    <Pressable onPress={onPress}>
      <View 
        className={`
          w-10 h-10 rounded-full 
          ${playerClasses.bg} 
          ${isSelected ? 'ring-4 ring-ludo-accent-gold' : ''}
          shadow-lg
        `}
      >
        <View className="w-6 h-6 bg-white rounded-full mx-auto mt-2 opacity-90" />
      </View>
    </Pressable>
  );
}

interface PlayerCardProps {
  playerIndex: number;
  playerName: string;
  isCurrentTurn?: boolean;
  score?: number;
}

export function PlayerCard({ 
  playerIndex, 
  playerName, 
  isCurrentTurn = false, 
  score = 0 
}: PlayerCardProps) {
  const playerClasses = ColorUtils.getPlayerClasses(playerIndex);
  
  return (
    <View 
      className={`
        p-4 rounded-xl border-2 
        ${isCurrentTurn ? 'border-ludo-accent-gold bg-ludo-accent-gold/10' : 'border-ludo-border-light bg-ludo-background-card'}
        shadow-md
      `}
    >
      <View className="flex-row items-center space-x-3">
        <View className={`w-8 h-8 rounded-full ${playerClasses.bg}`} />
        <View className="flex-1">
          <Text className="text-ludo-text-primary font-bold">{playerName}</Text>
          <Text className="text-ludo-text-secondary text-sm">Score: {score}</Text>
        </View>
        {isCurrentTurn && (
          <View className="bg-ludo-accent-gold px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">TURN</Text>
          </View>
        )}
      </View>
    </View>
  );
}

interface DiceProps {
  value: number;
  isRolling?: boolean;
  onRoll?: () => void;
}

export function Dice({ value, isRolling = false, onRoll }: DiceProps) {
  const dots = Array.from({ length: value }, (_, i) => i);
  
  return (
    <Pressable 
      onPress={onRoll}
      className={`
        w-16 h-16 bg-white border-2 border-ludo-border-dark rounded-lg 
        shadow-lg flex items-center justify-center
        ${isRolling ? 'animate-spin' : ''}
      `}
    >
      <View className="flex-row flex-wrap w-12 h-12 p-1">
        {dots.map((_, index) => (
          <View 
            key={index}
            className="w-2 h-2 bg-ludo-text-primary rounded-full m-0.5"
          />
        ))}
      </View>
    </Pressable>
  );
}

interface GameBoardCellProps {
  type: 'normal' | 'safe' | 'home' | 'start' | 'center';
  playerIndex?: number;
  hasPiece?: boolean;
  children?: React.ReactNode;
}

export function GameBoardCell({ 
  type, 
  playerIndex, 
  hasPiece = false, 
  children 
}: GameBoardCellProps) {
  const getCellStyle = () => {
    switch (type) {
      case 'safe':
        return 'bg-ludo-board-safe border-ludo-accent-success';
      case 'home':
        return playerIndex !== undefined 
          ? `bg-ludo-${['red', 'blue', 'green', 'yellow'][playerIndex]}-100 border-ludo-${['red', 'blue', 'green', 'yellow'][playerIndex]}-500`
          : 'bg-ludo-board-home border-ludo-border-medium';
      case 'start':
        return playerIndex !== undefined
          ? `bg-ludo-${['red', 'blue', 'green', 'yellow'][playerIndex]}-500`
          : 'bg-ludo-board-path border-ludo-border-medium';
      case 'center':
        return 'bg-ludo-board-center border-ludo-accent-gold';
      default:
        return 'bg-ludo-board-path border-ludo-border-light';
    }
  };

  return (
    <View 
      className={`
        w-8 h-8 border-2 ${getCellStyle()}
        flex items-center justify-center
      `}
    >
      {hasPiece && playerIndex !== undefined && (
        <GamePiece playerIndex={playerIndex} />
      )}
      {children}
    </View>
  );
}

interface GameStatusBarProps {
  currentPlayer: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  winner?: number;
}

export function GameStatusBar({ currentPlayer, gamePhase, winner }: GameStatusBarProps) {
  const getStatusText = () => {
    switch (gamePhase) {
      case 'waiting':
        return 'Waiting for players...';
      case 'playing':
        return `${['Red', 'Blue', 'Green', 'Yellow'][currentPlayer]}'s turn`;
      case 'finished':
        return winner !== undefined 
          ? `🎉 ${['Red', 'Blue', 'Green', 'Yellow'][winner]} Player Wins!`
          : 'Game finished';
      default:
        return 'Game status unknown';
    }
  };

  const getStatusColor = () => {
    switch (gamePhase) {
      case 'waiting':
        return 'bg-ludo-text-muted';
      case 'playing':
        const playerClasses = ColorUtils.getPlayerClasses(currentPlayer);
        return playerClasses.bg;
      case 'finished':
        return 'bg-ludo-accent-gold';
      default:
        return 'bg-ludo-text-muted';
    }
  };

  return (
    <View className={`${getStatusColor()} p-3 rounded-lg shadow-md`}>
      <Text className="text-white text-center font-bold">
        {getStatusText()}
      </Text>
    </View>
  );
}
