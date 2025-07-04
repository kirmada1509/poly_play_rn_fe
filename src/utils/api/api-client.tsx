// src/lib/apiClient.ts
import { useAuthStore } from '@/src/lib/auth/auth-store';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = 'http://192.168.29.57:8000';

// Toggle logging for production vs development
const ENABLE_LOGGING = __DEV__ ?? true;

class APIClient {
  private client: AxiosInstance;

  private log(type: 'request' | 'response' | 'error', data: any) {
    if (!ENABLE_LOGGING) return;
    
    const emoji = type === 'request' ? '🚀' : type === 'response' ? '✅' : '❌';
    console.log(`${emoji} API ${type}:`, data);
  }

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log outgoing request
        this.log('request', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          headers: config.headers,
          data: config.data,
          params: config.params,
          timestamp: new Date().toISOString()
        });

        return config;
      },
      (error) => {
        this.log('error', { message: 'Request setup failed', error });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful response
        this.log('response', {
          method: response.config.method?.toUpperCase(),
          url: `${response.config.baseURL}${response.config.url}`,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          duration: response.headers['x-response-time'] || 'N/A',
          timestamp: new Date().toISOString()
        });

        return response;
      },
      async (error: AxiosError) => {
        // Log error response
        this.log('error', {
          method: error.config?.method?.toUpperCase(),
          url: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
          status: error.response?.status,
          statusText: error.response?.statusText,
          errorMessage: error.message,
          responseData: error.response?.data,
          timestamp: new Date().toISOString()
        });

        if (error.response?.status === 401) {
          useAuthStore.getState().logout(); // optional: force logout on token expire
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: AxiosError) {
    const message =
      error.response?.data ||
      error.message ||
      'Something went wrong';
    return { status: error.response?.status, message };
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config).then((res) => res.data);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config).then((res) => res.data);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config).then((res) => res.data);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config).then((res) => res.data);
  }
}

const api = new APIClient();
export default api;
