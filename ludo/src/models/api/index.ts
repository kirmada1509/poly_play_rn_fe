// Authentication API types
export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    username: string;
  };
  access_token: string;
}

export interface UserResponse {
  uid: string;
  email: string;
  username: string;
}

// Wallet API types
export interface WalletCreateRequest {
  initial_balance?: number;
}

export interface WalletResponse {
  success: boolean;
  wallet: {
    id: string;
    user_id: string;
    balance: number;
  };
  message: string;
}

export interface BalanceResponse {
  success: boolean;
  balance: number;
  user_id: string;
}

export interface AddFundsRequest {
  amount: number;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  new_balance: number;
}

// Game API types
export interface GameCreateRequest {
  user_ids: string[];
}

export interface PawnDto {
  id: number;
  player_id: number;
  color: string;
  position: number;
  is_finished: boolean;
  is_in_safe_zone: boolean;
  is_in_yard: boolean;
  is_in_barracks: boolean;
  is_in_home_track: boolean;
}

export interface PlayerDto {
  user_id: string;
  id: number;
  color: string;
  start_position: number;
  pawns: PawnDto[];
}

export interface DiceDto {
  value: number;
  can_roll: boolean;
  repeated_rolls: number;
}

export interface BoardDto {
  dice: DiceDto;
  players: PlayerDto[];
  current_player_id: number;
  state: 'idle' | 'waiting_for_dice_roll' | 'waiting_for_pawn_move' | 'finished';
}

export interface GameDto {
  game_id: string;
  user_ids: string[];
  board: BoardDto;
  state: 'not_started' | 'in_progress' | 'finished';
  winner_id?: string;
  created_at: string;
  completed_at?: string;
}

export interface GameResponse {
  success: boolean;
  game: GameDto;
  message: string;
}

export interface RollDiceRequest {
  user_id: string;
}

export interface MovePawnRequest {
  user_id: string;
  pawn_id: number;
}

export interface ValidMovesResponse {
  success: boolean;
  valid_moves: Array<{
    pawn_id: number;
    from_position: number;
    to_position: number;
    can_move: boolean;
    reason?: string;
  }>;
}

// WebSocket message types
export interface WebSocketMessage {
  event: string;
  payload?: any;
  send_to_all?: boolean;
}

export interface RoomDto {
  id: string;
  name: string;
  creator_id: string;
  users: string[];
  bet_amount: number;
  total_bet_amount: number;
  game_id?: string;
}

export interface RegisterRoomRequest {
  room_name: string;
  bet_amount: number;
}

export interface JoinRoomRequest {
  room_name: string;
}

export interface CreateGameRequest {
  room_name: string;
}

// Error response types
export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ErrorResponse {
  detail: string | ValidationError[];
}
