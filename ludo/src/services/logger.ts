import { LOG_LEVELS, LogLevel } from "@/utils";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  context?: string;
}

class Logger {
  private isDevelopment = __DEV__;
  private logLevel: LogLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LOG_LEVELS)[Object.values(LOG_LEVELS).indexOf(level)];
    const contextStr = context ? ` [${context}]` : '';
    return `${timestamp} [${levelName}]${contextStr}: ${message}`;
  }

  private addLog(level: LogLevel, message: string, data?: any, context?: string) {
    const logEntry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      context,
    };

    this.logs.push(logEntry);
    
    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  debug(message: string, data?: any, context?: string) {
    if (!this.shouldLog(LOG_LEVELS.DEBUG)) return;
    
    this.addLog(LOG_LEVELS.DEBUG, message, data, context);
    const formattedMessage = this.formatMessage(LOG_LEVELS.DEBUG, message, context);
    
    if (this.isDevelopment) {
      console.log(formattedMessage, data || '');
    }
  }

  info(message: string, data?: any, context?: string) {
    if (!this.shouldLog(LOG_LEVELS.INFO)) return;
    
    this.addLog(LOG_LEVELS.INFO, message, data, context);
    const formattedMessage = this.formatMessage(LOG_LEVELS.INFO, message, context);
    
    if (this.isDevelopment) {
      console.info(formattedMessage, data || '');
    }
  }

  warn(message: string, data?: any, context?: string) {
    if (!this.shouldLog(LOG_LEVELS.WARN)) return;
    
    this.addLog(LOG_LEVELS.WARN, message, data, context);
    const formattedMessage = this.formatMessage(LOG_LEVELS.WARN, message, context);
    
    if (this.isDevelopment) {
      console.warn(formattedMessage, data || '');
    }
  }

  error(message: string, error?: any, context?: string) {
    if (!this.shouldLog(LOG_LEVELS.ERROR)) return;
    
    this.addLog(LOG_LEVELS.ERROR, message, error, context);
    const formattedMessage = this.formatMessage(LOG_LEVELS.ERROR, message, context);
    
    if (this.isDevelopment) {
      console.error(formattedMessage, error || '');
    }
  }

  // API-specific logging methods
  apiRequest(method: string, url: string, data?: any) {
    this.debug(`API Request: ${method} ${url}`, data, 'API');
  }

  apiResponse(method: string, url: string, status: number, data?: any) {
    this.debug(`API Response: ${method} ${url} - ${status}`, data, 'API');
  }

  apiError(method: string, url: string, error: any) {
    this.error(`API Error: ${method} ${url}`, error, 'API');
  }

  // WebSocket-specific logging methods
  wsConnect(url: string) {
    this.info(`WebSocket connecting to: ${url}`, undefined, 'WebSocket');
  }

  wsConnected(url: string) {
    this.info(`WebSocket connected to: ${url}`, undefined, 'WebSocket');
  }

  wsDisconnected(url: string, reason?: string) {
    this.warn(`WebSocket disconnected from: ${url}`, { reason }, 'WebSocket');
  }

  wsSend(event: string, data?: any) {
    this.debug(`WebSocket Send: ${event}`, data, 'WebSocket');
  }

  wsReceive(event: string, data?: any) {
    this.debug(`WebSocket Receive: ${event}`, data, 'WebSocket');
  }

  wsError(error: any) {
    this.error('WebSocket Error', error, 'WebSocket');
  }

  // Game-specific logging methods
  gameAction(action: string, data?: any) {
    this.info(`Game Action: ${action}`, data, 'Game');
  }

  gameStateChange(from: string, to: string, data?: any) {
    this.info(`Game State: ${from} -> ${to}`, data, 'Game');
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;
