import { apiClient } from './base';
import { API_CONFIG } from 'ludo/src/utils/constants';
import {
  GameCreateRequest,
  GameResponse,
  RollDiceRequest,
  MovePawnRequest,
  ValidMovesResponse,
  GameDto,
} from 'ludo/src/models/api';

export class GameApiClient {
  async createGame(data: GameCreateRequest): Promise<GameResponse> {
    const response = await apiClient.post<GameResponse>(
      API_CONFIG.ENDPOINTS.GAMES.CREATE,
      data
    );
    return response.data;
  }

  async startGame(gameId: string): Promise<GameResponse> {
    const response = await apiClient.post<GameResponse>(
      `${API_CONFIG.ENDPOINTS.GAMES.START}/${gameId}`
    );
    return response.data;
  }

  async rollDice(gameId: string, data: RollDiceRequest): Promise<GameResponse> {
    const response = await apiClient.post<GameResponse>(
      `${API_CONFIG.ENDPOINTS.GAMES.ROLL_DICE}/${gameId}/${data.user_id}`,
      data
    );
    return response.data;
  }

  async movePawn(gameId: string, data: MovePawnRequest): Promise<GameResponse> {
    const response = await apiClient.post<GameResponse>(
      `${API_CONFIG.ENDPOINTS.GAMES.MOVE_PAWN}/${gameId}/${data.user_id}`,
      data
    );
    return response.data;
  }

  async getValidMoves(gameId: string, userId: string): Promise<ValidMovesResponse> {
    const response = await apiClient.get<ValidMovesResponse>(
      `${API_CONFIG.ENDPOINTS.GAMES.VALID_MOVES}/${gameId}/${userId}`
    );
    return response.data;
  }

  async skipTurn(gameId: string, userId: string): Promise<GameResponse> {
    const response = await apiClient.post<GameResponse>(
      `${API_CONFIG.ENDPOINTS.GAMES.SKIP_TURN}/${gameId}/${userId}`
    );
    return response.data;
  }

  async getGame(gameId: string): Promise<GameDto> {
    const response = await apiClient.get<GameDto>(
      `${API_CONFIG.ENDPOINTS.GAMES.GET_GAME}/${gameId}`
    );
    return response.data;
  }

  async getBoardInfo(gameId: string): Promise<any> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.GAMES.BOARD_INFO}/${gameId}`
    );
    return response.data;
  }
}

export const gameApi = new GameApiClient();
