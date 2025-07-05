import { create } from 'zustand';
import { Wallet } from 'ludo/src/models/entities';
import { walletApi } from 'ludo/src/api/clients';
import { wsClient } from 'ludo/src/clients';
import { logger } from 'ludo/src/services/logger';
import { toast } from 'ludo/src/services/toast';

interface WalletState {
  wallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
}

interface WalletActions {
  createWallet: (initialBalance?: number) => Promise<void>;
  loadWallet: () => Promise<void>;
  addFunds: (amount: number) => Promise<void>;
  checkSufficientFunds: (amount: number) => Promise<boolean>;
  updateBalance: (newBalance: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type WalletStore = WalletState & WalletActions;

const initialState: WalletState = {
  wallet: null,
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletStore>()((set, get) => ({
  ...initialState,

  createWallet: async (initialBalance?: number) => {
    set({ isLoading: true, error: null });
    
    try {
      logger.info('Creating wallet', { initialBalance }, 'Wallet');
      
      const response = await walletApi.createWallet(
        initialBalance ? { initial_balance: initialBalance } : undefined
      );
      
      set({
        wallet: {
          id: response.wallet.id,
          userId: response.wallet.user_id,
          balance: response.wallet.balance,
        },
        isLoading: false,
        error: null,
      });

      logger.info('Wallet created successfully', response.wallet, 'Wallet');
      toast.success('Wallet Created', `Starting balance: $${response.wallet.balance}`);
      
    } catch (error: any) {
      logger.error('Failed to create wallet', error, 'Wallet');
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to create wallet',
      });
      toast.apiError(error, 'Failed to create wallet');
      throw error;
    }
  },

  loadWallet: async () => {
    set({ isLoading: true, error: null });
    
    try {
      logger.debug('Loading wallet details', undefined, 'Wallet');
      
      const response = await walletApi.getWalletDetails();
      
      set({
        wallet: {
          id: response.wallet.id,
          userId: response.wallet.user_id,
          balance: response.wallet.balance,
        },
        isLoading: false,
        error: null,
      });

      logger.debug('Wallet loaded successfully', response.wallet, 'Wallet');
      
    } catch (error: any) {
      logger.error('Failed to load wallet', error, 'Wallet');
      
      // If wallet doesn't exist, try to create one
      if (error.response?.status === 404) {
        logger.info('Wallet not found, creating new wallet', undefined, 'Wallet');
        try {
          await get().createWallet();
          return;
        } catch (createError) {
          // Fall through to error handling
        }
      }
      
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to load wallet',
      });
      toast.apiError(error, 'Failed to load wallet');
      throw error;
    }
  },

  addFunds: async (amount: number) => {
    if (amount <= 0) {
      toast.error('Invalid amount', 'Amount must be greater than 0');
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      logger.info('Adding funds to wallet', { amount }, 'Wallet');
      
      const response = await walletApi.addFunds({ amount });
      
      set((state) => ({
        wallet: state.wallet ? {
          ...state.wallet,
          balance: response.new_balance,
        } : null,
        isLoading: false,
        error: null,
      }));

      logger.info('Funds added successfully', { newBalance: response.new_balance }, 'Wallet');
      toast.success('Funds Added', `New balance: $${response.new_balance}`);
      
    } catch (error: any) {
      logger.error('Failed to add funds', error, 'Wallet');
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to add funds',
      });
      toast.apiError(error, 'Failed to add funds');
      throw error;
    }
  },

  checkSufficientFunds: async (amount: number) => {
    try {
      logger.debug('Checking sufficient funds', { amount }, 'Wallet');
      
      const response = await walletApi.checkSufficientFunds(amount);
      
      logger.debug('Sufficient funds check result', response, 'Wallet');
      return response.sufficient;
      
    } catch (error: any) {
      logger.error('Failed to check sufficient funds', error, 'Wallet');
      toast.apiError(error, 'Failed to check funds');
      return false;
    }
  },

  updateBalance: (newBalance: number) => {
    set((state) => ({
      wallet: state.wallet ? {
        ...state.wallet,
        balance: newBalance,
      } : null,
    }));
    
    logger.info('Wallet balance updated', { newBalance }, 'Wallet');
    toast.walletUpdate(`Balance updated: $${newBalance}`);
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
    if (error) {
      logger.error('Wallet error set', error, 'Wallet');
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    logger.info('Resetting wallet store', undefined, 'Wallet');
    set(initialState);
  },
}));
