// Constants for the application
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  WS_URL: 'ws://localhost:8000',
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/auth/signup',
      LOGIN: '/auth/login',
      ME: '/auth/me',
    },
    WALLET: {
      CREATE: '/wallet/create',
      BALANCE: '/wallet/balance',
      DETAILS: '/wallet/',
      ADD_FUNDS: '/wallet/add-funds',
      SUFFICIENT_FUNDS: '/wallet/sufficient-funds',
    },
    GAMES: {
      CREATE: '/games/create',
      START: '/games/start',
      ROLL_DICE: '/games/roll-dice',
      MOVE_PAWN: '/games/move-pawn',
      VALID_MOVES: '/games/valid-moves',
      SKIP_TURN: '/games/skip-turn',
      GET_GAME: '/games',
      BOARD_INFO: '/games/board-info',
    },
  },
};

export const WS_EVENTS = {
  // Outgoing events
  REGISTER_ROOM: 'register_room',
  JOIN_ROOM: 'join_room',
  CREATE_GAME: 'create_game',
  START_GAME: 'start_game',
  ROLL_DICE: 'roll_dice',
  MOVE_PAWN: 'move_pawn',
  GET_WALLET_BALANCE: 'get_wallet_balance',
  ADD_FUNDS: 'add_funds',
  TEST: 'test',
  
  // Incoming events (server responses)
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  GAME_CREATED: 'game_created',
  GAME_STARTED: 'game_started',
  DICE_ROLLED: 'dice_rolled',
  PAWN_MOVED: 'pawn_moved',
  WALLET_UPDATED: 'wallet_updated',
  ERROR: 'error',
};

export const GAME_CONFIG = {
  MAX_PLAYERS: 4,
  PAWNS_PER_PLAYER: 4,
  BOARD_POSITIONS: 52,
  COLORS: ['red', 'green', 'blue', 'yellow'] as const,
  START_POSITIONS: [50, 11, 24, 37],
  HOME_ENTRY_POSITIONS: [51, 12, 25, 38],
  SAFE_ZONES: [1, 8, 14, 21, 27, 34, 40, 47],
  HOME_TRACKS: {
    0: [52, 53, 54, 55, 56, 57], // Red
    1: [58, 59, 60, 61, 62, 63], // Green
    2: [64, 65, 66, 67, 68, 69], // Blue
    3: [70, 71, 72, 73, 74, 75], // Yellow
  },
};

export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DICE_ROLL_DURATION: 1000,
  TOAST_DURATION: 3000,
  BOARD_SIZE: 300,
  PAWN_SIZE: 16,
  DICE_SIZE: 40,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@polyplay:auth_token',
  USER_DATA: '@polyplay:user_data',
  GAME_SETTINGS: '@polyplay:game_settings',
};

export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];
export type GameColor = typeof GAME_CONFIG.COLORS[number];
