import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from 'ludo/src/utils/constants';
import { logger } from 'ludo/src/services/logger';
import { toast } from 'ludo/src/services/toast';

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadAuthToken();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Log request
        logger.apiRequest(
          config.method?.toUpperCase() || 'UNKNOWN',
          `${config.baseURL}${config.url}`,
          config.data
        );

        return config;
      },
      (error: AxiosError) => {
        logger.apiError('REQUEST', 'unknown', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful response
        logger.apiResponse(
          response.config.method?.toUpperCase() || 'UNKNOWN',
          `${response.config.baseURL}${response.config.url}`,
          response.status,
          response.data
        );

        return response;
      },
      (error: AxiosError) => {
        // Log error response
        logger.apiError(
          error.config?.method?.toUpperCase() || 'UNKNOWN',
          `${error.config?.baseURL}${error.config?.url}`,
          error
        );

        // Handle common error scenarios
        this.handleApiError(error);

        return Promise.reject(error);
      }
    );
  }

  private handleApiError(error: AxiosError) {
    if (!error.response) {
      // Network error
      toast.networkError();
      return;
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 401:
        // Unauthorized - clear auth token and redirect to login
        this.clearAuthToken();
        toast.error('Session Expired', 'Please log in again');
        break;
      case 403:
        toast.error('Access Denied', 'You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Not Found', 'The requested resource was not found');
        break;
      case 422:
        // Validation error
        if (data.detail && Array.isArray(data.detail)) {
          const validationErrors = data.detail.map((err: any) => err.msg).join(', ');
          toast.error('Validation Error', validationErrors);
        } else {
          toast.apiError(error, 'Validation failed');
        }
        break;
      case 500:
        toast.error('Server Error', 'An internal server error occurred');
        break;
      default:
        toast.apiError(error);
        break;
    }
  }

  private async loadAuthToken() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        this.authToken = token;
        logger.debug('Auth token loaded from storage', undefined, 'ApiClient');
      }
    } catch (error) {
      logger.error('Failed to load auth token from storage', error, 'ApiClient');
    }
  }

  async setAuthToken(token: string) {
    this.authToken = token;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      logger.info('Auth token set and stored', undefined, 'ApiClient');
    } catch (error) {
      logger.error('Failed to store auth token', error, 'ApiClient');
    }
  }

  async clearAuthToken() {
    this.authToken = null;
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      logger.info('Auth token cleared', undefined, 'ApiClient');
    } catch (error) {
      logger.error('Failed to clear auth token', error, 'ApiClient');
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // HTTP method wrappers
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Raw axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
