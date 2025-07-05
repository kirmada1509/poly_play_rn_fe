import { apiClient } from './base';
import { API_CONFIG } from 'ludo/src/utils/constants';
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
} from 'ludo/src/models/api';

export class AuthApiClient {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
      data
    );
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  }

  async getMe(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(
      API_CONFIG.ENDPOINTS.AUTH.ME
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.clearAuthToken();
  }
}

export const authApi = new AuthApiClient();
