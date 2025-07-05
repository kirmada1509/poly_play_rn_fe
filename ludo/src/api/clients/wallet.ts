import { apiClient } from './base';
import { API_CONFIG } from 'ludo/src/utils/constants';
import {
  WalletCreateRequest,
  WalletResponse,
  BalanceResponse,
  AddFundsRequest,
  TransactionResponse,
} from 'ludo/src/models/api';

export class WalletApiClient {
  async createWallet(data?: WalletCreateRequest): Promise<WalletResponse> {
    const response = await apiClient.post<WalletResponse>(
      API_CONFIG.ENDPOINTS.WALLET.CREATE,
      data || {}
    );
    return response.data;
  }

  async getBalance(): Promise<BalanceResponse> {
    const response = await apiClient.get<BalanceResponse>(
      API_CONFIG.ENDPOINTS.WALLET.BALANCE
    );
    return response.data;
  }

  async getWalletDetails(): Promise<WalletResponse> {
    const response = await apiClient.get<WalletResponse>(
      API_CONFIG.ENDPOINTS.WALLET.DETAILS
    );
    return response.data;
  }

  async addFunds(data: AddFundsRequest): Promise<TransactionResponse> {
    const response = await apiClient.post<TransactionResponse>(
      API_CONFIG.ENDPOINTS.WALLET.ADD_FUNDS,
      data
    );
    return response.data;
  }

  async checkSufficientFunds(amount: number): Promise<{ sufficient: boolean }> {
    const response = await apiClient.get<{ sufficient: boolean }>(
      `${API_CONFIG.ENDPOINTS.WALLET.SUFFICIENT_FUNDS}/${amount}`
    );
    return response.data;
  }
}

export const walletApi = new WalletApiClient();
