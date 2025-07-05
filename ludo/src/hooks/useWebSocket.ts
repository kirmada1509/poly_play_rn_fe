import { useEffect, useCallback } from 'react';
import { useAuthStore, useGameStore, useWalletStore } from 'ludo/src/store';
import { wsClient } from 'ludo/src/clients';
import { logger } from 'ludo/src/services/logger';
import { toast } from 'ludo/src/services/toast';

/**
 * Hook to manage WebSocket connection and handle real-time events
 */
export const useWebSocket = () => {
  const { user, isAuthenticated } = useAuthStore();
  const gameStore = useGameStore();
  const walletStore = useWalletStore();

  // Initialize WebSocket connection
  const connect = useCallback(async () => {
    if (!isAuthenticated || !user) {
      logger.warn('Cannot connect WebSocket: User not authenticated', undefined, 'WebSocket');
      return;
    }

    try {
      await wsClient.connect();
      gameStore.setConnected(true);
      
      // Set up event handlers
      setupEventHandlers();
      
    } catch (error) {
      logger.error('Failed to connect WebSocket', error, 'WebSocket');
      gameStore.setConnected(false);
    }
  }, [isAuthenticated, user, gameStore]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    wsClient.disconnect();
    gameStore.setConnected(false);
  }, [gameStore]);

  // Set up WebSocket event handlers
  const setupEventHandlers = useCallback(() => {
    // Room events
    wsClient.on('room_created', (data) => {
      logger.info('Room created', data, 'WebSocket');
      gameStore.updateRoom(data.room);
      toast.success('Room Created', `Room "${data.room.name}" is ready!`);
    });

    wsClient.on('room_joined', (data) => {
      logger.info('Room joined', data, 'WebSocket');
      gameStore.updateRoom(data.room);
      toast.success('Joined Room', `Welcome to "${data.room.name}"`);
    });

    wsClient.on('room_update', (data) => {
      logger.info('Room updated', data, 'WebSocket');
      gameStore.updateRoom(data.room);
    });

    // Game events
    wsClient.on('game_created', (data) => {
      logger.info('Game created', data, 'WebSocket');
      gameStore.updateGame(data.game);
      toast.success('Game Created', 'Game is ready to start!');
    });

    wsClient.on('game_started', (data) => {
      logger.info('Game started', data, 'WebSocket');
      gameStore.updateGame(data.game);
      toast.gameSuccess('Game Started!');
    });

    wsClient.on('game_update', (data) => {
      logger.info('Game updated', data, 'WebSocket');
      gameStore.updateGame(data.game);
    });

    wsClient.on('dice_rolled', (data) => {
      logger.info('Dice rolled', data, 'WebSocket');
      gameStore.setAnimating(false);
      
      if (data.game) {
        gameStore.updateGame(data.game);
      }
      
      // Show dice result
      toast.info('Dice Rolled', `Rolled a ${data.dice_value || data.value}`);
    });

    wsClient.on('pawn_moved', (data) => {
      logger.info('Pawn moved', data, 'WebSocket');
      gameStore.setAnimating(false);
      
      if (data.game) {
        gameStore.updateGame(data.game);
      }
      
      toast.info('Pawn Moved', `Pawn moved from ${data.from_position} to ${data.to_position}`);
    });

    wsClient.on('game_finished', (data) => {
      logger.info('Game finished', data, 'WebSocket');
      
      if (data.game) {
        gameStore.updateGame(data.game);
      }
      
      const isWinner = data.winner_id === user?.uid;
      
      if (isWinner) {
        toast.success('🎉 You Won!', `Prize: $${data.prize_amount}`);
      } else {
        toast.info('Game Finished', `Winner: ${data.winner_id}`);
      }
    });

    // Wallet events
    wsClient.on('wallet_update', (data) => {
      logger.info('Wallet updated', data, 'WebSocket');
      walletStore.updateBalance(data.balance);
    });

    wsClient.on('funds_added', (data) => {
      logger.info('Funds added', data, 'WebSocket');
      walletStore.updateBalance(data.new_balance);
      toast.success('Funds Added', `New balance: $${data.new_balance}`);
    });

    // Error handling
    wsClient.on('error', (data) => {
      logger.error('WebSocket error received', data, 'WebSocket');
      gameStore.setError(data.message || 'An error occurred');
    });

    // Test event
    wsClient.on('test_response', (data) => {
      logger.info('Test response received', data, 'WebSocket');
      toast.info('Test Response', data.message || 'WebSocket is working!');
    });

  }, [gameStore, walletStore, user?.uid]);

  // Connect on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user, connect, disconnect]);

  return {
    isConnected: gameStore.isConnected,
    connect,
    disconnect,
    // Expose WebSocket client methods
    createRoom: wsClient.registerRoom.bind(wsClient),
    joinRoom: wsClient.joinRoom.bind(wsClient),
    createGame: wsClient.createGame.bind(wsClient),
    startGame: wsClient.startGame.bind(wsClient),
    rollDice: wsClient.rollDice.bind(wsClient),
    movePawn: wsClient.movePawn.bind(wsClient),
    getWalletBalance: wsClient.getWalletBalance.bind(wsClient),
    addFunds: wsClient.addFunds.bind(wsClient),
    test: wsClient.test.bind(wsClient),
  };
};
