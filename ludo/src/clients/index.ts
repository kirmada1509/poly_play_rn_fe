import { io, Socket } from 'socket.io-client';
import { API_CONFIG, WS_EVENTS } from 'ludo/src/utils/constants';
import { logger } from 'ludo/src/services/logger';
import { toast } from 'ludo/src/services/toast';
import { apiClient } from 'ludo/src/api/clients/base';
import {
  WebSocketMessage,
  RegisterRoomRequest,
  JoinRoomRequest,
  CreateGameRequest,
  RoomDto,
  GameDto,
  AddFundsRequest,
} from 'ludo/src/models/api';

export type WebSocketEventHandler = (data: any) => void;

interface EventHandlers {
  [eventName: string]: WebSocketEventHandler[];
}

class WebSocketClient {
  private socket: Socket | null = null;
  private isConnected = false;
  private eventHandlers: EventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const authToken = apiClient.getAuthToken();
      
      if (!authToken) {
        const error = new Error('No authentication token available');
        logger.error('WebSocket connection failed: No auth token', error, 'WebSocket');
        reject(error);
        return;
      }

      logger.wsConnect(API_CONFIG.WS_URL);

      this.socket = io(API_CONFIG.WS_URL, {
        transports: ['websocket'],
        extraHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventListeners(resolve, reject);
    });
  }

  private setupEventListeners(
    onConnect: () => void,
    onError: (error: Error) => void
  ) {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      logger.wsConnected(API_CONFIG.WS_URL);
      toast.connectionStatus(true);
      onConnect();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      logger.wsDisconnected(API_CONFIG.WS_URL, reason);
      toast.connectionStatus(false);
    });

    this.socket.on('connect_error', (error) => {
      logger.wsError(error);
      if (this.reconnectAttempts === 0) {
        // Only show error on first attempt
        toast.error('Connection Failed', 'Unable to connect to game server');
      }
      this.reconnectAttempts++;
      onError(error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      logger.info(`WebSocket reconnected after ${attemptNumber} attempts`, undefined, 'WebSocket');
      toast.success('Reconnected', 'Connection to game server restored');
    });

    this.socket.on('reconnect_failed', () => {
      logger.error('WebSocket reconnection failed after maximum attempts', undefined, 'WebSocket');
      toast.error('Connection Failed', 'Unable to reconnect to game server');
    });

    // Handle incoming messages
    this.socket.onAny((eventName: string, data: any) => {
      logger.wsReceive(eventName, data);
      this.handleIncomingMessage(eventName, data);
    });
  }

  private handleIncomingMessage(eventName: string, data: any) {
    // Execute registered handlers for this event
    const handlers = this.eventHandlers[eventName] || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        logger.error(`Error in WebSocket event handler for ${eventName}`, error, 'WebSocket');
      }
    });

    // Handle common error cases
    if (eventName === 'error') {
      toast.error('Server Error', data.message || 'An error occurred');
    }
  }

  disconnect() {
    if (this.socket) {
      logger.info('Disconnecting WebSocket', undefined, 'WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event subscription methods
  on(eventName: string, handler: WebSocketEventHandler) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }

  off(eventName: string, handler?: WebSocketEventHandler) {
    if (!this.eventHandlers[eventName]) return;

    if (handler) {
      const index = this.eventHandlers[eventName].indexOf(handler);
      if (index > -1) {
        this.eventHandlers[eventName].splice(index, 1);
      }
    } else {
      // Remove all handlers for this event
      this.eventHandlers[eventName] = [];
    }
  }

  // Send message to server
  private send(eventName: string, payload?: any) {
    if (!this.socket || !this.isConnected) {
      logger.error('Cannot send message: WebSocket not connected', { eventName, payload }, 'WebSocket');
      toast.error('Connection Error', 'Not connected to game server');
      return;
    }

    logger.wsSend(eventName, payload);
    this.socket.emit(eventName, payload);
  }

  // Room management methods
  registerRoom(roomName: string, betAmount: number) {
    this.send(WS_EVENTS.REGISTER_ROOM, {
      room_name: roomName,
      bet_amount: betAmount,
    } as RegisterRoomRequest);
  }

  joinRoom(roomName: string) {
    this.send(WS_EVENTS.JOIN_ROOM, {
      room_name: roomName,
    } as JoinRoomRequest);
  }

  createGame(roomName: string) {
    this.send(WS_EVENTS.CREATE_GAME, {
      room_name: roomName,
    } as CreateGameRequest);
  }

  startGame(gameId: string) {
    this.send(WS_EVENTS.START_GAME, {
      game_id: gameId,
    });
  }

  // Game action methods
  rollDice(gameId: string, userId: string) {
    this.send(WS_EVENTS.ROLL_DICE, {
      game_id: gameId,
      user_id: userId,
    });
  }

  movePawn(gameId: string, userId: string, pawnId: number) {
    this.send(WS_EVENTS.MOVE_PAWN, {
      game_id: gameId,
      user_id: userId,
      pawn_id: pawnId,
    });
  }

  // Wallet methods
  getWalletBalance() {
    this.send(WS_EVENTS.GET_WALLET_BALANCE);
  }

  addFunds(amount: number) {
    this.send(WS_EVENTS.ADD_FUNDS, {
      amount,
    } as AddFundsRequest);
  }

  // Utility methods
  test(message: string = 'Hello WebSocket!') {
    this.send(WS_EVENTS.TEST, { message });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Convenience methods for common event subscriptions
  onRoomUpdate(handler: (room: RoomDto) => void) {
    this.on('room_update', handler);
  }

  onGameUpdate(handler: (game: GameDto) => void) {
    this.on('game_update', handler);
  }

  onDiceRolled(handler: (data: { game_id: string; dice_value: number; next_player: number }) => void) {
    this.on('dice_rolled', handler);
  }

  onPawnMoved(handler: (data: { game_id: string; pawn_id: number; from_position: number; to_position: number }) => void) {
    this.on('pawn_moved', handler);
  }

  onGameFinished(handler: (data: { game_id: string; winner_id: string; prize_amount: number }) => void) {
    this.on('game_finished', handler);
  }

  onWalletUpdate(handler: (data: { balance: number; user_id: string }) => void) {
    this.on('wallet_update', handler);
  }

  onError(handler: (error: any) => void) {
    this.on('error', handler);
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();
export default wsClient;
