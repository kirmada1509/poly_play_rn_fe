import { apiClient, authApi } from '@/api/clients';
import {User} from '../models/entities/entities'
import logger from '../services/logger';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from '../services/toast';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          logger.info('Attempting login', { email }, 'Auth');
          
          const response = await authApi.login({ email, password });
          
          // Set auth token
          await apiClient.setAuthToken(response.access_token);
          
          // Update store
          set({
            user: {
              ...response.user,
              authToken: response.access_token,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          logger.info('Login successful', { userId: response.user.uid }, 'Auth');
          toast.success('Welcome back!', `Logged in as ${response.user.username}`);
          
        } catch (error: any) {
          logger.error('Login failed', error, 'Auth');
          set({
            isLoading: false,
            error: error.response?.data?.detail || 'Login failed',
          });
          toast.apiError(error, 'Login failed');
          throw error;
        }
      },

      signup: async (email: string, username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          logger.info('Attempting signup', { email, username }, 'Auth');
          
          const response = await authApi.signup({ email, username, password });
          
          // Set auth token
          await apiClient.setAuthToken(response.access_token);
          
          // Update store
          set({
            user: {
              ...response.user,
              authToken: response.access_token,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          logger.info('Signup successful', { userId: response.user.uid }, 'Auth');
          toast.success('Welcome to PolyPlay!', `Account created for ${response.user.username}`);
          
        } catch (error: any) {
          logger.error('Signup failed', error, 'Auth');
          set({
            isLoading: false,
            error: error.response?.data?.detail || 'Signup failed',
          });
          toast.apiError(error, 'Signup failed');
          throw error;
        }
      },

      logout: async () => {
        try {
          logger.info('Logging out', undefined, 'Auth');
          
          await authApi.logout();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          logger.info('Logout successful', undefined, 'Auth');
          toast.info('Logged out', 'Come back soon!');
          
        } catch (error: any) {
          logger.error('Logout error', error, 'Auth');
          // Clear state anyway
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshUser: async () => {
        if (!apiClient.isAuthenticated()) {
          return;
        }

        try {
          const userData = await authApi.getMe();
          
          set({
            user: {
              ...userData,
              authToken: apiClient.getAuthToken() || undefined,
            },
            isAuthenticated: true,
          });

          logger.debug('User data refreshed', { userId: userData.uid }, 'Auth');
          
        } catch (error: any) {
          logger.error('Failed to refresh user data', error, 'Auth');
          
          // If unauthorized, clear auth
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'polyplay-auth',
      storage: createJSONStorage(() => ({
        getItem: async (key: string) => {
          // For now, return null to avoid AsyncStorage dependency errors
          // TODO: Implement proper AsyncStorage when deps are resolved
          return null;
        },
        setItem: async (key: string, value: string) => {
          // TODO: Implement proper AsyncStorage when deps are resolved
        },
        removeItem: async (key: string) => {
          // TODO: Implement proper AsyncStorage when deps are resolved
        },
      })),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
