import { GameColor, GAME_CONFIG } from './constants';
import { Pawn, Player, Game } from 'ludo/src/models/entities';

/**
 * Get color hex code for game piece
 */
export const getColorHex = (color: GameColor): string => {
  const colorMap: Record<GameColor, string> = {
    red: '#ef4444',
    green: '#22c55e',
    blue: '#3b82f6',
    yellow: '#f59e0b',
  };
  
  return colorMap[color];
};

/**
 * Get player color by player ID
 */
export const getPlayerColor = (playerId: number): GameColor => {
  return GAME_CONFIG.COLORS[playerId] || 'red';
};

/**
 * Check if position is a safe zone
 */
export const isSafeZone = (position: number): boolean => {
  return GAME_CONFIG.SAFE_ZONES.includes(position);
};

/**
 * Check if position is a start position
 */
export const isStartPosition = (position: number): boolean => {
  return GAME_CONFIG.START_POSITIONS.includes(position);
};

/**
 * Check if position is a home entry position
 */
export const isHomeEntryPosition = (position: number): boolean => {
  return GAME_CONFIG.HOME_ENTRY_POSITIONS.includes(position);
};

/**
 * Check if position is in home track
 */
export const isInHomeTrack = (position: number): boolean => {
  return position >= 52 && position <= 75;
};

/**
 * Get home track positions for a player
 */
export const getHomeTrackPositions = (playerId: number): number[] => {
  return GAME_CONFIG.HOME_TRACKS[playerId as keyof typeof GAME_CONFIG.HOME_TRACKS] || [];
};

/**
 * Calculate next position after moving dice steps
 */
export const calculateNextPosition = (
  currentPosition: number,
  diceValue: number,
  playerId: number
): number => {
  // If pawn is in barracks (-1), can only exit with 6
  if (currentPosition === -1) {
    return diceValue === 6 ? GAME_CONFIG.START_POSITIONS[playerId] : -1;
  }

  // If pawn is finished (-2), cannot move
  if (currentPosition === -2) {
    return -2;
  }

  // If in home track, move within track
  if (isInHomeTrack(currentPosition)) {
    const homeTrack = getHomeTrackPositions(playerId);
    const currentIndex = homeTrack.indexOf(currentPosition);
    const nextIndex = currentIndex + diceValue;
    
    // If would go beyond home track, must land exactly
    if (nextIndex >= homeTrack.length) {
      return currentPosition; // Cannot move
    }
    
    // If landing on last position, pawn is finished
    if (nextIndex === homeTrack.length - 1) {
      return -2; // Finished
    }
    
    return homeTrack[nextIndex];
  }

  // Normal board movement
  let nextPosition = (currentPosition + diceValue) % GAME_CONFIG.BOARD_POSITIONS;
  
  // Check if should enter home track
  const homeEntryPosition = GAME_CONFIG.HOME_ENTRY_POSITIONS[playerId];
  if (nextPosition === homeEntryPosition) {
    const homeTrack = getHomeTrackPositions(playerId);
    return homeTrack[0]; // Enter home track
  }

  return nextPosition;
};

/**
 * Check if a pawn can kill another pawn at a position
 */
export const canKillPawn = (
  attackerPawn: Pawn,
  targetPawn: Pawn,
  position: number
): boolean => {
  // Cannot kill own pawns
  if (attackerPawn.playerId === targetPawn.playerId) {
    return false;
  }

  // Cannot kill in safe zones
  if (isSafeZone(position)) {
    return false;
  }

  // Cannot kill in home tracks
  if (isInHomeTrack(position)) {
    return false;
  }

  // Cannot kill finished pawns
  if (targetPawn.isFinished) {
    return false;
  }

  return true;
};

/**
 * Get pawns that can be moved with current dice value
 */
export const getMovablePawns = (
  player: Player,
  diceValue: number,
  allPlayers: Player[]
): Pawn[] => {
  return player.pawns.filter(pawn => {
    // Skip finished pawns
    if (pawn.isFinished) {
      return false;
    }

    // If in barracks, can only move with 6
    if (pawn.isInBarracks && diceValue !== 6) {
      return false;
    }

    // Calculate where pawn would move
    const nextPosition = calculateNextPosition(pawn.position, diceValue, player.id);
    
    // If cannot move (would go beyond home track)
    if (nextPosition === pawn.position) {
      return false;
    }

    return true;
  });
};

/**
 * Get all pawns at a specific position
 */
export const getPawnsAtPosition = (position: number, allPlayers: Player[]): Pawn[] => {
  const pawns: Pawn[] = [];
  
  allPlayers.forEach(player => {
    player.pawns.forEach(pawn => {
      if (pawn.position === position && !pawn.isFinished) {
        pawns.push(pawn);
      }
    });
  });
  
  return pawns;
};

/**
 * Check if game is finished
 */
export const isGameFinished = (game: Game): boolean => {
  return game.players.some(player => 
    player.pawns.every(pawn => pawn.isFinished)
  );
};

/**
 * Get winner of the game
 */
export const getGameWinner = (game: Game): Player | null => {
  return game.players.find(player => 
    player.pawns.every(pawn => pawn.isFinished)
  ) || null;
};

/**
 * Calculate game progress for a player (percentage of pawns finished)
 */
export const getPlayerProgress = (player: Player): number => {
  const finishedPawns = player.pawns.filter(pawn => pawn.isFinished).length;
  return (finishedPawns / GAME_CONFIG.PAWNS_PER_PLAYER) * 100;
};

/**
 * Get position coordinates for UI rendering
 */
export const getPositionCoordinates = (
  position: number,
  boardSize: number
): { x: number; y: number } => {
  // This would be implemented based on your board layout
  // For now, return a simple circular arrangement
  const angle = (position / GAME_CONFIG.BOARD_POSITIONS) * 2 * Math.PI;
  const radius = boardSize * 0.4;
  const centerX = boardSize / 2;
  const centerY = boardSize / 2;
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};

/**
 * Check if it's a player's turn
 */
export const isPlayerTurn = (game: Game, playerId: number): boolean => {
  return game.board.currentPlayerId === playerId;
};
