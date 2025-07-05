import { useEffect, useState } from 'react';
import { useGameStore, useAuthStore } from 'ludo/src/store';
import { gameApi } from 'ludo/src/api/clients';
import { logger } from 'ludo/src/services/logger';
import { ValidMove } from 'ludo/src/models/entities';

/**
 * Hook to manage game actions and state
 */
export const useGameActions = () => {
  const gameStore = useGameStore();
  const { user } = useAuthStore();
  const [validMoves, setValidMoves] = useState<ValidMove[]>([]);

  // Get valid moves for current player
  const getValidMoves = async () => {
    const { game } = gameStore;
    if (!game || !user) return;

    try {
      const response = await gameApi.getValidMoves(game.gameId, user.uid);
      setValidMoves(response.valid_moves.map(move => ({
        pawnId: move.pawn_id,
        fromPosition: move.from_position,
        toPosition: move.to_position,
        canMove: move.can_move,
        reason: move.reason,
      })));
    } catch (error) {
      logger.error('Failed to get valid moves', error, 'Game');
    }
  };

  // Check if a pawn can be moved
  const canMovePawn = (pawnId: number): boolean => {
    return validMoves.some(move => move.pawnId === pawnId && move.canMove);
  };

  // Get move for a specific pawn
  const getPawnMove = (pawnId: number): ValidMove | undefined => {
    return validMoves.find(move => move.pawnId === pawnId);
  };

  // Handle pawn selection with validation
  const selectPawn = (pawnId: number) => {
    if (!user || !gameStore.canMovePawn(user.uid)) {
      return;
    }

    const move = getPawnMove(pawnId);
    if (!move || !move.canMove) {
      logger.warn('Cannot select pawn', { pawnId, reason: move?.reason }, 'Game');
      return;
    }

    gameStore.selectPawn(pawnId);
    gameStore.setHighlightedPositions([move.toPosition]);
    gameStore.setShowValidMoves(true);
  };

  // Clear selection
  const clearSelection = () => {
    gameStore.selectPawn(null);
    gameStore.setHighlightedPositions([]);
    gameStore.setShowValidMoves(false);
  };

  // Execute move
  const executeMove = () => {
    const { selectedPawn } = gameStore;
    if (selectedPawn === null) return;

    gameStore.movePawn(selectedPawn);
    clearSelection();
  };

  // Update valid moves when game state changes
  useEffect(() => {
    if (user && gameStore.canMovePawn(user.uid)) {
      getValidMoves();
    } else {
      setValidMoves([]);
      clearSelection();
    }
  }, [gameStore.game?.board.state, gameStore.game?.board.currentPlayerId, user]);

  return {
    validMoves,
    canMovePawn,
    getPawnMove,
    selectPawn,
    clearSelection,
    executeMove,
    getValidMoves,
    
    // Game state helpers
    isMyTurn: user ? gameStore.isMyTurn(user.uid) : false,
    canRoll: user ? gameStore.canRollDice(user.uid) : false,
    canMove: user ? gameStore.canMovePawn(user.uid) : false,
    currentPlayer: gameStore.getCurrentPlayer(),
    
    // UI state
    selectedPawn: gameStore.selectedPawn,
    highlightedPositions: gameStore.highlightedPositions,
    isAnimating: gameStore.isAnimating,
    showValidMoves: gameStore.showValidMoves,
  };
};
