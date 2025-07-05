import {Game, Room} from '../models/entities/entities'
import { create } from 'zustand';
import { wsClient } from '../clients';
import { logger } from '../services/logger';
import { toast } from '../services/toast';

interface GameState {
  // Current game data
  game: Game | null;
  currentRoom: Room | null;
  availableRooms: Room[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  selectedPawn: number | null;
  highlightedPositions: number[];
  isAnimating: boolean;
  showValidMoves: boolean;
  
  // Connection state
  isConnected: boolean;
}

interface GameActions {
  // Room management
  createRoom: (roomName: string, betAmount: number) => void;
  joinRoom: (roomName: string) => void;
  leaveRoom: () => void;
  updateRoom: (room: Room) => void;
  setAvailableRooms: (rooms: Room[]) => void;
  
  // Game management
  createGame: (roomName: string) => void;
  startGame: (gameId: string) => void;
  updateGame: (game: Game) => void;
  
  // Game actions
  rollDice: () => void;
  movePawn: (pawnId: number) => void;
  selectPawn: (pawnId: number | null) => void;
  setHighlightedPositions: (positions: number[]) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setAnimating: (animating: boolean) => void;
  setShowValidMoves: (show: boolean) => void;
  setConnected: (connected: boolean) => void;
  
  // Utility
  reset: () => void;
  getCurrentPlayer: () => number | null;
  isMyTurn: (userId: string) => boolean;
  canRollDice: (userId: string) => boolean;
  canMovePawn: (userId: string) => boolean;
}

export type GameStore = GameState & GameActions;

const initialState: GameState = {
  game: null,
  currentRoom: null,
  availableRooms: [],
  isLoading: false,
  error: null,
  selectedPawn: null,
  highlightedPositions: [],
  isAnimating: false,
  showValidMoves: false,
  isConnected: false,
};

export const useGameStore = create<GameStore>()((set, get) => ({
  ...initialState,

  // Room management
  createRoom: (roomName: string, betAmount: number) => {
    logger.gameAction('Creating room', { roomName, betAmount });
    set({ isLoading: true, error: null });
    wsClient.registerRoom(roomName, betAmount);
  },

  joinRoom: (roomName: string) => {
    logger.gameAction('Joining room', { roomName });
    set({ isLoading: true, error: null });
    wsClient.joinRoom(roomName);
  },

  leaveRoom: () => {
    logger.gameAction('Leaving room');
    set({ currentRoom: null });
  },

  updateRoom: (room: Room) => {
    logger.gameAction('Room updated', room);
    set({ currentRoom: room, isLoading: false });
  },

  setAvailableRooms: (rooms: Room[]) => {
    set({ availableRooms: rooms });
  },

  // Game management
  createGame: (roomName: string) => {
    logger.gameAction('Creating game', { roomName });
    set({ isLoading: true, error: null });
    wsClient.createGame(roomName);
  },

  startGame: (gameId: string) => {
    logger.gameAction('Starting game', { gameId });
    set({ isLoading: true, error: null });
    wsClient.startGame(gameId);
  },

  updateGame: (game: Game) => {
    const currentGame = get().game;
    const oldState = currentGame?.board.state;
    const newState = game.board.state;
    
    if (oldState !== newState) {
      logger.gameStateChange(oldState || 'none', newState);
    }
    
    set({ 
      game,
      isLoading: false,
      error: null,
      // Clear UI state when game updates
      selectedPawn: null,
      highlightedPositions: [],
    });
  },

  // Game actions
  rollDice: () => {
    const { game } = get();
    if (!game) {
      toast.error('No active game');
      return;
    }

    logger.gameAction('Rolling dice', { gameId: game.gameId });
    set({ isAnimating: true });
    
    // Assume current user ID is available from auth store
    // TODO: Get actual user ID from auth store
    const userId = 'current-user-id';
    wsClient.rollDice(game.gameId, userId);
  },

  movePawn: (pawnId: number) => {
    const { game, selectedPawn } = get();
    if (!game) {
      toast.error('No active game');
      return;
    }

    const finalPawnId = selectedPawn !== null ? selectedPawn : pawnId;
    logger.gameAction('Moving pawn', { gameId: game.gameId, pawnId: finalPawnId });
    
    set({ 
      isAnimating: true,
      selectedPawn: null,
      highlightedPositions: [],
      showValidMoves: false,
    });
    
    // TODO: Get actual user ID from auth store
    const userId = 'current-user-id';
    wsClient.movePawn(game.gameId, userId, finalPawnId);
  },

  selectPawn: (pawnId: number | null) => {
    set({ selectedPawn: pawnId });
  },

  setHighlightedPositions: (positions: number[]) => {
    set({ highlightedPositions: positions });
  },

  // UI actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
    if (error) {
      logger.error('Game error set', error, 'Game');
      toast.gameError(error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setAnimating: (animating: boolean) => {
    set({ isAnimating: animating });
  },

  setShowValidMoves: (show: boolean) => {
    set({ showValidMoves: show });
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },

  // Utility
  reset: () => {
    logger.gameAction('Resetting game store');
    set(initialState);
  },

  getCurrentPlayer: () => {
    const { game } = get();
    return game?.board.currentPlayerId ?? null;
  },

  isMyTurn: (userId: string) => {
    const { game } = get();
    if (!game) return false;
    
    const currentPlayerId = game.board.currentPlayerId;
    const myPlayerIndex = game.userIds.indexOf(userId);
    
    return currentPlayerId === myPlayerIndex;
  },

  canRollDice: (userId: string) => {
    const { game } = get();
    if (!game) return false;
    
    return (
      get().isMyTurn(userId) &&
      game.board.state === 'waiting_for_dice_roll' &&
      game.board.dice.canRoll
    );
  },

  canMovePawn: (userId: string) => {
    const { game } = get();
    if (!game) return false;
    
    return (
      get().isMyTurn(userId) &&
      game.board.state === 'waiting_for_pawn_move'
    );
  },
}));
