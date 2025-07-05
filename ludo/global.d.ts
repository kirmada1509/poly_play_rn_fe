/// <reference types="expo/types" />

// Global type declarations for PolyPlay app

declare global {
  var __DEV__: boolean;
}

// Module declarations for packages without TypeScript definitions
declare module 'react-native-toast-message' {
  import { Component } from 'react';
  
  interface ToastProps {
    type?: 'success' | 'error' | 'info';
    position?: 'top' | 'bottom';
    text1?: string;
    text2?: string;
    visibilityTime?: number;
    autoHide?: boolean;
    onShow?: () => void;
    onHide?: () => void;
    onPress?: () => void;
    text1Style?: any;
    text2Style?: any;
  }
  
  class Toast extends Component {
    static show(options: ToastProps): void;
    static hide(): void;
  }
  
  export default Toast;
}

declare module 'socket.io-client' {
  export interface Socket {
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback?: (data: any) => void): void;
    emit(event: string, data?: any): void;
    connect(): void;
    disconnect(): void;
    onAny(callback: (event: string, data: any) => void): void;
  }
  
  export function io(url: string, options?: any): Socket;
}

// Expo Constants module extension
declare module 'expo-constants' {
  interface Constants {
    expoConfig: {
      extra: {
        apiUrl: string;
        wsUrl: string;
      };
    };
  }
  
  const Constants: Constants;
  export default Constants;
}

// React Native Vector Icons
declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  
  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }
  
  class Icon extends Component<IconProps> {}
  export default Icon;
}

// AsyncStorage
declare module '@react-native-async-storage/async-storage' {
  interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
    multiGet(keys: string[]): Promise<[string, string | null][]>;
    multiSet(keyValuePairs: [string, string][]): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
  }
  
  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

// NativeWind CSS class types (basic)
declare module 'nativewind' {
  export function styled<T>(component: T): T;
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    EXPO_PUBLIC_API_URL: string;
    EXPO_PUBLIC_WS_URL: string;
  }
}

export {};
