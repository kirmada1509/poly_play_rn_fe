import { GameColor } from "@/utils";


// User entity
export interface User {
  uid: string;
  email: string;
  username: string;
  authToken?: string;
}

// Wallet entity
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

// Game entities
export interface Pawn {
  id: number;
  playerId: number;
  color: GameColor;
  position: number;
  isFinished: boolean;
  isInSafeZone: boolean;
  isInYard: boolean;
  isInBarracks: boolean;
  isInHomeTrack: boolean;
}

export interface Player {
  userId: string;
  id: number;
  color: GameColor;
  startPosition: number;
  pawns: Pawn[];
  isCurrentPlayer?: boolean;
}

export interface Dice {
  value: number;
  canRoll: boolean;
  repeatedRolls: number;
}

export type BoardState = 'idle' | 'waiting_for_dice_roll' | 'waiting_for_pawn_move' | 'finished';
export type GameState = 'not_started' | 'in_progress' | 'finished';

export interface Board {
  dice: Dice;
  players: Player[];
  currentPlayerId: number;
  state: BoardState;
}

export interface Game {
  gameId: string;
  userIds: string[];
  board: Board;
  state: GameState;
  winnerId?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Room entity
export interface Room {
  id: string;
  name: string;
  creatorId: string;
  users: string[];
  betAmount: number;
  totalBetAmount: number;
  gameId?: string;
  playerCount: number;
  maxPlayers: number;
}

// Move validation
export interface ValidMove {
  pawnId: number;
  fromPosition: number;
  toPosition: number;
  canMove: boolean;
  reason?: string;
}

// Game events
export interface GameEvent {
  type: 'dice_roll' | 'pawn_move' | 'player_join' | 'player_leave' | 'game_start' | 'game_end';
  playerId?: number;
  data?: any;
  timestamp: Date;
}

// UI state
export interface UiState {
  selectedPawn?: number;
  highlightedPositions: number[];
  isAnimating: boolean;
  showValidMoves: boolean;
}

// App state
export interface AppState {
  isConnected: boolean;
  isLoading: boolean;
  error?: string;
  currentScreen: string;
}
