import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { GameColor } from 'ludo/src/utils/constants';

interface DiceProps {
  value: number;
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
  isRolling?: boolean;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  size = 40,
  disabled = false,
  onPress,
  isRolling = false,
}) => {
  const getDotPositions = (value: number) => {
    const positions: { top: number; left: number }[] = [];
    
    switch (value) {
      case 1:
        positions.push({ top: size * 0.5 - 2, left: size * 0.5 - 2 });
        break;
      case 2:
        positions.push({ top: size * 0.25, left: size * 0.25 });
        positions.push({ top: size * 0.75 - 4, left: size * 0.75 - 4 });
        break;
      case 3:
        positions.push({ top: size * 0.25, left: size * 0.25 });
        positions.push({ top: size * 0.5 - 2, left: size * 0.5 - 2 });
        positions.push({ top: size * 0.75 - 4, left: size * 0.75 - 4 });
        break;
      case 4:
        positions.push({ top: size * 0.25, left: size * 0.25 });
        positions.push({ top: size * 0.25, left: size * 0.75 - 4 });
        positions.push({ top: size * 0.75 - 4, left: size * 0.25 });
        positions.push({ top: size * 0.75 - 4, left: size * 0.75 - 4 });
        break;
      case 5:
        positions.push({ top: size * 0.2, left: size * 0.2 });
        positions.push({ top: size * 0.2, left: size * 0.8 - 4 });
        positions.push({ top: size * 0.5 - 2, left: size * 0.5 - 2 });
        positions.push({ top: size * 0.8 - 4, left: size * 0.2 });
        positions.push({ top: size * 0.8 - 4, left: size * 0.8 - 4 });
        break;
      case 6:
        positions.push({ top: size * 0.2, left: size * 0.25 });
        positions.push({ top: size * 0.2, left: size * 0.75 - 4 });
        positions.push({ top: size * 0.5 - 2, left: size * 0.25 });
        positions.push({ top: size * 0.5 - 2, left: size * 0.75 - 4 });
        positions.push({ top: size * 0.8 - 4, left: size * 0.25 });
        positions.push({ top: size * 0.8 - 4, left: size * 0.75 - 4 });
        break;
    }
    
    return positions;
  };

  const diceStyle = {
    width: size,
    height: size,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    position: 'relative' as const,
    opacity: disabled ? 0.5 : 1,
  };

  const dotStyle = {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1f2937',
    position: 'absolute' as const,
  };

  const renderDice = () => (
    <View style={diceStyle}>
      {getDotPositions(isRolling ? Math.floor(Math.random() * 6) + 1 : value).map((position, index) => (
        <View
          key={index}
          style={[dotStyle, { top: position.top, left: position.left }]}
        />
      ))}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {renderDice()}
      </TouchableOpacity>
    );
  }

  return renderDice();
};

interface PawnProps {
  color: GameColor;
  size?: number;
  isSelected?: boolean;
  isHighlighted?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const Pawn: React.FC<PawnProps> = ({
  color,
  size = 16,
  isSelected = false,
  isHighlighted = false,
  onPress,
  disabled = false,
}) => {
  const getColorHex = (color: GameColor): string => {
    const colorMap: Record<GameColor, string> = {
      red: '#ef4444',
      green: '#22c55e',
      blue: '#3b82f6',
      yellow: '#f59e0b',
    };
    return colorMap[color];
  };

  const pawnStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: getColorHex(color),
    borderWidth: isSelected ? 3 : 2,
    borderColor: isSelected ? '#ffffff' : '#000000',
    opacity: disabled ? 0.5 : 1,
    elevation: isHighlighted ? 8 : 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: isHighlighted ? 4 : 2,
  };

  const renderPawn = () => <View style={pawnStyle} />;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {renderPawn()}
      </TouchableOpacity>
    );
  }

  return renderPawn();
};
