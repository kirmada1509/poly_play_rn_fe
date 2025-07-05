import Toast from 'react-native-toast-message';
import { logger } from './logger';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  text1?: string;
  text2?: string;
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
}

class ToastService {
  private static readonly DEFAULT_VISIBILITY_TIME = 3000;

  private getToastConfig(type: ToastType): { type: string; text1Color?: string; text2Color?: string } {
    switch (type) {
      case 'success':
        return { type: 'success', text1Color: '#065f46', text2Color: '#047857' };
      case 'error':
        return { type: 'error', text1Color: '#7f1d1d', text2Color: '#991b1b' };
      case 'warning':
        return { type: 'info', text1Color: '#78350f', text2Color: '#92400e' };
      case 'info':
      default:
        return { type: 'info', text1Color: '#0c4a6e', text2Color: '#075985' };
    }
  }

  show(type: ToastType, message: string, subtitle?: string, options?: ToastOptions) {
    const config = this.getToastConfig(type);
    
    // Log the toast for debugging
    logger.info(`Toast: ${type.toUpperCase()} - ${message}`, { subtitle, options }, 'Toast');

    Toast.show({
      type: config.type,
      position: options?.position || 'top',
      text1: options?.text1 || message,
      text2: options?.text2 || subtitle,
      visibilityTime: options?.visibilityTime || ToastService.DEFAULT_VISIBILITY_TIME,
      autoHide: options?.autoHide !== false,
      onShow: options?.onShow,
      onHide: options?.onHide,
      onPress: options?.onPress,
      text1Style: {
        fontSize: 16,
        fontWeight: '600',
        color: config.text1Color,
      },
      text2Style: {
        fontSize: 14,
        fontWeight: '400',
        color: config.text2Color,
      },
    });
  }

  success(message: string, subtitle?: string, options?: ToastOptions) {
    this.show('success', message, subtitle, options);
  }

  error(message: string, subtitle?: string, options?: ToastOptions) {
    this.show('error', message, subtitle, options);
  }

  warning(message: string, subtitle?: string, options?: ToastOptions) {
    this.show('warning', message, subtitle, options);
  }

  info(message: string, subtitle?: string, options?: ToastOptions) {
    this.show('info', message, subtitle, options);
  }

  hide() {
    Toast.hide();
    logger.debug('Toast hidden', undefined, 'Toast');
  }

  // Convenience methods for common scenarios
  apiError(error: any, defaultMessage = 'An error occurred') {
    let message = defaultMessage;
    let subtitle = '';

    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error?.message) {
      message = error.message;
    }

    if (error?.response?.status) {
      subtitle = `Error ${error.response.status}`;
    }

    this.error(message, subtitle);
  }

  networkError() {
    this.error(
      'Network Error',
      'Please check your internet connection and try again.'
    );
  }

  gameError(message: string) {
    this.error('Game Error', message);
  }

  gameSuccess(message: string) {
    this.success('Game Update', message);
  }

  walletUpdate(message: string) {
    this.info('Wallet Update', message);
  }

  connectionStatus(isConnected: boolean) {
    if (isConnected) {
      this.success('Connected', 'Connected to game server');
    } else {
      this.warning('Disconnected', 'Connection to game server lost');
    }
  }
}

// Export singleton instance
export const toast = new ToastService();
export default toast;
