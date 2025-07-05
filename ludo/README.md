# PolyPlay Frontend - React Native Expo App

A full-featured multiplayer Ludo game frontend built with React Native, Expo, TypeScript, and TailwindCSS (NativeWind). Features real-time gameplay, integrated betting system, and clean architecture.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── api/clients/          # HTTP API clients with Axios interceptors
├── websocket/clients/    # WebSocket client with Socket.IO
├── models/              # Data models and types
│   ├── api/            # API DTOs and request/response types
│   └── entities/       # Internal domain entities
├── store/              # Zustand state management
├── services/           # Core services (Logger, Toast)
├── hooks/              # Custom React hooks
├── screens/            # Application screens/pages
├── components/         # Reusable UI components
└── utils/              # Utilities, constants, and helpers
```

## 🚀 Key Features

### 🎮 Game Features
- **Real-time Multiplayer**: Up to 4 players with WebSocket communication
- **Classic Ludo Rules**: Traditional gameplay with modern UI
- **Betting System**: Real money stakes with wallet integration
- **Live Game Updates**: Instant dice rolls, pawn movements, and game state changes

### 🎨 UI/UX Features
- **Arcade Theme**: Bold, colorful design with game-inspired aesthetics
- **Responsive Design**: Works across different screen sizes
- **Smooth Animations**: Dice rolls, pawn movements, and transitions
- **Toast Notifications**: Real-time feedback for all actions

### 🔧 Technical Features
- **Clean Architecture**: Modular, testable, and maintainable code
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient global state
- **Real-time Communication**: Socket.IO for game events
- **Error Handling**: Comprehensive error handling with user feedback
- **Logging**: Structured logging for debugging and monitoring

## 📁 Detailed Directory Structure

### API Layer (`src/api/clients/`)
```typescript
// Base API client with interceptors
apiClient.ts         # Axios instance with auth, logging, error handling
auth.ts             # Authentication endpoints
wallet.ts           # Wallet management endpoints
game.ts             # Game-related endpoints
index.ts            # Exports
```

**Features:**
- Automatic JWT token management
- Request/response logging
- Error handling with toast notifications
- Network error detection
- Automatic token refresh (future)

### WebSocket Layer (`src/websocket/clients/`)
```typescript
// Real-time communication
index.ts            # Socket.IO client with event management
```

**Features:**
- Automatic reconnection
- Event subscription management
- Connection status tracking
- Error handling and recovery
- Structured message logging

### Data Models (`src/models/`)
```typescript
// API Models (src/models/api/)
index.ts            # API DTOs, request/response types

// Domain Entities (src/models/entities/)
index.ts            # Internal business logic models
```

**API Models Include:**
- Authentication requests/responses
- Game state DTOs
- Wallet transaction types
- WebSocket message formats

**Entity Models Include:**
- User, Game, Player, Pawn entities
- UI state models
- Validation rules

### State Management (`src/store/`)
```typescript
authStore.ts        # Authentication state (login, user data)
gameStore.ts        # Game state (current game, rooms, UI state)
walletStore.ts      # Wallet state (balance, transactions)
index.ts            # Store exports
```

**Store Features:**
- Zustand for lightweight state management
- Persistence for auth data
- Async actions with error handling
- Computed values and selectors

### Services (`src/services/`)
```typescript
logger.ts           # Structured logging service
toast.ts            # Toast notification service
```

**Logger Service:**
- Development/production modes
- Contextual logging (API, WebSocket, Game, etc.)
- Log levels (DEBUG, INFO, WARN, ERROR)
- Structured log entries with timestamps

**Toast Service:**
- Success, error, warning, info types
- API error handling
- Network error notifications
- Game event notifications

### Custom Hooks (`src/hooks/`)
```typescript
useWebSocket.ts     # WebSocket connection and event handling
useGameActions.ts   # Game-specific actions and validations
index.ts            # Hook exports
```

**Hook Features:**
- WebSocket lifecycle management
- Game action validation
- Move calculation and validation
- Real-time event handling

### Screens (`src/screens/`)
```typescript
GameBoardScreen.tsx # Main game interface with board and controls
LobbyScreen.tsx     # Room browsing and matchmaking
// Additional screens...
```

**Screen Features:**
- Full game board visualization
- Real-time game controls
- Room management interface
- Responsive layouts

### Components (`src/components/`)
```typescript
Button.tsx          # Themed button component
GamePieces.tsx      # Dice and Pawn components
// Additional components...
```

**Component Features:**
- Consistent theming
- Interactive game pieces
- Reusable UI elements
- Accessibility support

### Utilities (`src/utils/`)
```typescript
constants.ts        # App constants and configuration
formatters.ts       # Formatting utilities
gameHelpers.ts      # Game logic helpers
theme.ts            # Theme configuration
index.ts            # Utility exports
```

## 🎯 Core Implementation Examples

### 1. Zustand Store Example (Auth)

```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          await apiClient.setAuthToken(response.access_token);
          set({
            user: { ...response.user, authToken: response.access_token },
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('Welcome back!');
        } catch (error) {
          set({ isLoading: false, error: 'Login failed' });
          toast.apiError(error);
        }
      },
      // ... other actions
    }),
    { name: 'polyplay-auth' }
  )
);
```

### 2. WebSocket Event Handler Example

```typescript
export const useWebSocket = () => {
  const setupEventHandlers = useCallback(() => {
    wsClient.on('dice_rolled', (data) => {
      logger.info('Dice rolled', data, 'WebSocket');
      gameStore.setAnimating(false);
      if (data.game) gameStore.updateGame(data.game);
      toast.info('Dice Rolled', `Rolled a ${data.dice_value}`);
    });

    wsClient.on('game_finished', (data) => {
      const isWinner = data.winner_id === user?.uid;
      if (isWinner) {
        toast.success('🎉 You Won!', `Prize: $${data.prize_amount}`);
      } else {
        toast.info('Game Finished', `Winner: ${data.winner_id}`);
      }
    });
  }, [gameStore, user?.uid]);
};
```

### 3. Axios Client with Interceptors

```typescript
class ApiClient {
  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.authToken && config.headers) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      logger.apiRequest(config.method?.toUpperCase(), config.url, config.data);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.apiResponse(response.config.method, response.config.url, response.status);
        return response;
      },
      (error) => {
        logger.apiError(error.config?.method, error.config?.url, error);
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }
}
```

### 4. Logger and Toast Usage

```typescript
// Structured logging
logger.info('User login attempt', { email }, 'Auth');
logger.error('WebSocket connection failed', error, 'WebSocket');
logger.gameAction('Dice rolled', { value: 6, playerId: 1 });

// Toast notifications
toast.success('Welcome back!', 'Login successful');
toast.apiError(error, 'Failed to load game');
toast.gameSuccess('Your turn!');
```

### 5. Game Board Component Example

```typescript
export const GameBoardScreen: React.FC = () => {
  const { game, isLoading } = useGameStore();
  const { isMyTurn, canRoll, validMoves, selectPawn } = useGameActions();

  const renderGameBoard = () => (
    <View style={styles.board}>
      {/* Render board positions */}
      {Array.from({ length: 52 }, (_, index) => {
        const position = getPositionCoordinates(index, BOARD_SIZE);
        return <View key={index} style={[styles.boardPosition, position]} />;
      })}

      {/* Render pawns */}
      {game?.board.players.map((player) =>
        player.pawns.map((pawn) => {
          if (pawn.position === -1 || pawn.isFinished) return null;
          const position = getPositionCoordinates(pawn.position, BOARD_SIZE);
          return (
            <Pawn
              key={`pawn-${player.id}-${pawn.id}`}
              color={getPlayerColor(player.id)}
              onPress={() => selectPawn(pawn.id)}
              style={position}
            />
          );
        })
      )}
    </View>
  );
};
```

## 🎨 Theme System

The app includes a flexible theme system supporting multiple visual styles:

```typescript
// Arcade theme - bold and colorful
export const arcadeTheme: Theme = {
  colors: {
    primary: '#f97316',    // Orange
    secondary: '#0ea5e9',  // Blue
    success: '#22c55e',    // Green
    danger: '#ef4444',     // Red
    background: '#fef7cd', // Light yellow
    // ... more colors
  },
  // Typography, spacing, shadows, etc.
};
```

## 🔧 Setup Instructions

1. **Install Dependencies**
```bash
npm install
# or
yarn install
```

2. **Start Development Server**
```bash
npm start
# or
expo start
```

3. **Run on Device/Simulator**
```bash
npm run ios
npm run android
```

## 🌐 Backend Integration

The frontend is designed to work with the PolyPlay backend API. Key integration points:

- **Authentication**: JWT token-based auth with automatic refresh
- **Game API**: RESTful endpoints for game management
- **WebSocket**: Real-time game events and updates
- **Wallet API**: Fund management and transactions

## 📱 Platform Support

- **iOS**: Native iOS app through Expo
- **Android**: Native Android app through Expo
- **Web**: PWA support through Expo Web

## 🧪 Development Features

- **Hot Reload**: Instant updates during development
- **Error Overlay**: Clear error messages in development
- **Debugging**: Comprehensive logging and error tracking
- **Type Safety**: Full TypeScript coverage

## 🚀 Production Considerations

- **Performance**: Optimized for smooth 60fps gameplay
- **Offline Handling**: Graceful degradation when disconnected
- **Error Recovery**: Automatic reconnection and state recovery
- **Analytics**: Structured logging for monitoring (future)

## 📖 Key Dependencies

- **React Native + Expo**: Cross-platform mobile development
- **TypeScript**: Type safety and developer experience
- **Zustand**: Lightweight state management
- **Axios**: HTTP client with interceptors
- **Socket.IO**: Real-time WebSocket communication
- **NativeWind**: TailwindCSS for React Native
- **React Native Toast Message**: User notifications

This architecture provides a solid foundation for a production-ready multiplayer gaming application with real-time features, comprehensive error handling, and excellent developer experience.
