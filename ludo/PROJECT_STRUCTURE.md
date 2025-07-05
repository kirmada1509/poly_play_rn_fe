# PolyPlay Frontend - Complete Project Structure

This document shows the complete file structure of the React Native Expo PolyPlay frontend application.

## 📁 Complete Directory Tree

```
polyplay-frontend/
├── package.json                    # Dependencies and scripts
├── app.json                       # Expo configuration
├── tsconfig.json                  # TypeScript configuration  
├── tailwind.config.js             # TailwindCSS configuration
├── babel.config.js                # Babel configuration
├── global.d.ts                    # Global TypeScript declarations
├── README.md                      # Project documentation
├── App.tsx                        # Main application component
│
├── assets/                        # Static assets (icons, images)
│   ├── icon.png                   # App icon
│   ├── splash.png                 # Splash screen
│   ├── adaptive-icon.png          # Android adaptive icon
│   └── favicon.png                # Web favicon
│
└── src/                           # Source code
    │
    ├── api/                       # HTTP API layer
    │   └── clients/
    │       ├── base.ts             # Base Axios client with interceptors
    │       ├── auth.ts             # Authentication API client
    │       ├── wallet.ts           # Wallet API client
    │       ├── game.ts             # Game API client
    │       └── index.ts            # API client exports
    │
    ├── websocket/                 # WebSocket communication layer
    │   └── clients/
    │       └── index.ts            # Socket.IO client with event handling
    │
    ├── models/                    # Data models and types
    │   ├── api/
    │   │   └── index.ts            # API DTOs and request/response types
    │   └── entities/
    │       └── index.ts            # Internal domain entities
    │
    ├── store/                     # Zustand state management
    │   ├── authStore.ts            # Authentication state
    │   ├── gameStore.ts            # Game and room state
    │   ├── walletStore.ts          # Wallet state
    │   └── index.ts                # Store exports
    │
    ├── services/                  # Core services
    │   ├── logger.ts               # Structured logging service
    │   └── toast.ts                # Toast notification service
    │
    ├── hooks/                     # Custom React hooks
    │   ├── useWebSocket.ts         # WebSocket connection management
    │   ├── useGameActions.ts       # Game action hooks
    │   └── index.ts                # Hook exports
    │
    ├── screens/                   # Application screens
    │   ├── GameBoardScreen.tsx     # Main game interface
    │   └── LobbyScreen.tsx         # Room browser and matchmaking
    │
    ├── components/                # Reusable UI components
    │   ├── Button.tsx              # Themed button component
    │   └── GamePieces.tsx          # Dice and Pawn components
    │
    └── utils/                     # Utilities and helpers
        ├── constants.ts            # App constants and configuration
        ├── formatters.ts           # Formatting utilities
        ├── gameHelpers.ts          # Game logic helpers
        ├── theme.ts                # Theme configuration
        └── index.ts                # Utility exports
```

## 🔧 Key Configuration Files

### package.json
```json
{
  "name": "polyplay-frontend",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.3",
    "zustand": "^4.3.9",
    "axios": "^1.4.0",
    "socket.io-client": "^4.7.2",
    "react-native-toast-message": "^2.1.6",
    "nativewind": "^2.0.11"
  }
}
```

### app.json (Expo Configuration)
```json
{
  "expo": {
    "name": "PolyPlay",
    "slug": "polyplay-ludo",
    "orientation": "portrait",
    "extra": {
      "apiUrl": "http://localhost:8000",
      "wsUrl": "ws://localhost:8000"
    }
  }
}
```

### tsconfig.json (TypeScript Configuration)
```json
{
  "compilerOptions": {
    "target": "esnext",
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/screens/*": ["./src/screens/*"]
    }
  }
}
```

## 🏗️ Architecture Layers

### 1. **Presentation Layer** (`screens/`, `components/`)
- React Native screens and reusable components
- Game board visualization and user interface
- Form handling and user interactions

### 2. **Business Logic Layer** (`hooks/`, `store/`)
- Custom hooks for complex logic
- Zustand stores for state management
- Game rules and validation logic

### 3. **Service Layer** (`services/`)
- Logging service for debugging and monitoring
- Toast service for user notifications
- Utility services for common operations

### 4. **Data Access Layer** (`api/`, `websocket/`)
- HTTP API clients with Axios
- WebSocket client for real-time communication
- Data transformation and error handling

### 5. **Domain Layer** (`models/`, `utils/`)
- Entity models and business objects
- Game logic helpers and calculations
- Constants and configuration

## 🎮 Core Features Implemented

### Authentication System
- JWT-based authentication
- Automatic token management
- Persistent login state
- Error handling and recovery

### Real-time Game Engine
- WebSocket communication
- Live game state synchronization
- Dice rolling and pawn movement
- Turn management and validation

### Wallet System
- Balance tracking and management
- Fund addition and deduction
- Transaction history (future)
- Betting integration

### UI/UX Features
- Arcade-style theme system
- Responsive game board
- Interactive game pieces
- Toast notifications
- Loading states and animations

## 🔄 Data Flow Architecture

```
User Action → Component → Hook → Store → API/WebSocket → Backend
                    ↓
              Toast/Logger ← Service Layer ← Response Processing
```

### Example: Dice Roll Flow
1. User taps dice → `GameBoardScreen`
2. Component calls → `useGameActions.rollDice()`
3. Hook validates → `gameStore.canRollDice()`
4. Store action → `gameStore.rollDice()`
5. WebSocket call → `wsClient.rollDice()`
6. Server response → WebSocket event handler
7. State update → `gameStore.updateGame()`
8. UI update → Component re-renders

## 🎨 Theme System

### Arcade Theme (Default)
- Bold, vibrant colors
- Playful visual elements
- High contrast for readability
- Game-inspired aesthetics

### Classic Theme (Alternative)
- Traditional Ludo colors
- Conservative design approach
- Professional appearance
- Subtle animations

## 📱 Platform Support

### Mobile (iOS/Android)
- Native performance with Expo
- Touch-optimized interactions
- Platform-specific adaptations
- Push notifications (future)

### Web (PWA)
- Responsive web interface
- Mouse and keyboard support
- Progressive web app features
- Cross-platform compatibility

## 🔧 Development Workflow

### Local Development
```bash
# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

### Building for Production
```bash
# Build for all platforms
expo build

# Platform-specific builds
expo build:ios
expo build:android
expo build:web
```

### Testing Strategy
- Unit tests for utilities and helpers
- Integration tests for API clients
- Component testing with React Native Testing Library
- E2E testing with Detox (future)

## 🚀 Deployment Options

### Expo Application Services (EAS)
- Managed build and deployment
- Over-the-air updates
- App store submission
- Development builds

### Self-hosted
- Custom CI/CD pipeline
- Direct app store deployment
- Manual update management
- Full control over build process

## 📊 Performance Considerations

### Optimization Strategies
- Lazy loading for screens
- Image optimization and caching
- WebSocket connection pooling
- State normalization
- Component memoization

### Monitoring and Analytics
- Structured logging for debugging
- Performance metrics tracking
- Error reporting and crash analytics
- User behavior analytics (future)

This architecture provides a scalable, maintainable foundation for a production-ready multiplayer gaming application with real-time features and excellent user experience.
