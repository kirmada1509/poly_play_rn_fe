# PolyPlay Application - Complete System Overview

This document provides a comprehensive explanation of the entire PolyPlay application, covering architecture, features, flow, and technical implementation details.

## 🎯 Application Overview

### What is PolyPlay?

PolyPlay is a **real-time multiplayer online gaming platform** that digitizes the classic board game Ludo (also known as Pachisi) with integrated betting functionality. The application enables 2-4 players to compete in real-time games where they can bet money and the winner takes the entire prize pool.

### Core Value Proposition

- **Real-time Multiplayer Gaming**: Instant gameplay with live updates
- **Integrated Betting System**: Players bet real money for exciting stakes
- **Secure Wallet Management**: Safe fund handling and transactions
- **Fair Gameplay**: Transparent game mechanics and rules
- **Cross-platform Compatibility**: Works on web browsers and mobile devices

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PolyPlay Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Frontend  │  │   Backend   │  │  Database   │             │
│  │   (Client)  │  │  (Server)   │  │  (MongoDB)  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                 │                 │                  │
│         │                 │                 │                  │
│  ┌──────▼──────┐ ┌────────▼────────┐ ┌──────▼──────┐           │
│  │ React Native│ │   FastAPI       │ │  Collections│           │
│  │             │ │   Python 3.10   │ │  - Users    │           │
│  │             │ │                 │ │  - Wallets  │           │
│  │ - Game UI   │ │ - HTTP Routes   │ │  - Games    │           │
│  │ - WebSocket │ │ - WebSocket     │ │  - Rooms    │           │
│  │ - State Mgmt│ │ - Game Logic    │ │  - Txns     │           │
│  └─────────────┘ └─────────────────┘ └─────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend (Server-Side)
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB with Beanie ODM
- **Authentication**: JWT (JSON Web Tokens)
- **WebSockets**: FastAPI WebSocket support
- **Security**: Bcrypt password hashing, CORS middleware
- **API Documentation**: Auto-generated OpenAPI/Swagger

#### Frontend (Client-Side)
- **Framework Options**: React Native
- **WebSocket Client**: Native WebSocket API or Socket.IO
- **State Management**: Context API, Redux, or Vuex
- **UI Components**: Custom components for game board
- **Authentication**: JWT token storage and management

#### Infrastructure
- **Database**: MongoDB Atlas or self-hosted MongoDB
- **Deployment**: Docker containers, cloud platforms
- **Security**: HTTPS/WSS, JWT validation, input sanitization

## 📋 Core Features Deep Dive

### 1. User Authentication System

#### Registration Process
```
User Input → Validation → Password Hashing → Database Storage → JWT Token Generation
```

**Components:**
- **Email Validation**: Ensures valid email format using Pydantic EmailStr
- **Password Security**: Bcrypt hashing with salt for secure storage
- **Username Uniqueness**: Prevents duplicate usernames
- **JWT Token**: Stateless authentication with user claims

**User Journey:**
1. User provides email, username, password
2. System validates input format and uniqueness
3. Password is hashed using bcrypt
4. User record created in MongoDB
5. JWT token generated with user ID and username
6. Token returned to client for future requests

#### Login Process
```
Credentials → Validation → Password Verification → JWT Token Generation
```

**Security Features:**
- **Password Verification**: Bcrypt compare against stored hash
- **Token Expiration**: 24-hour token lifetime
- **Error Handling**: Generic error messages to prevent user enumeration

### 2. Wallet Management System

#### Wallet Architecture
Every user has exactly one wallet that manages their funds for betting.

**Wallet Properties:**
- **Unique ID**: UUID-based wallet identifier
- **User Association**: One-to-one relationship with user
- **Balance Tracking**: Precise float-based balance management
- **Transaction History**: Future feature for audit trails

#### Financial Operations

**Fund Addition (Testing/Demo):**
```python
# Internal flow
user_wallet = get_wallet(user_id)
user_wallet.balance += amount
save_wallet(user_wallet)
```

**Bet Deduction:**
```python
# When game starts
for player in game_players:
    wallet = get_wallet(player.user_id)
    if wallet.balance >= bet_amount:
        wallet.balance -= bet_amount
        total_prize_pool += bet_amount
    else:
        raise InsufficientFundsError()
```

**Prize Distribution:**
```python
# When game ends
winner_wallet = get_wallet(winner_user_id)
winner_wallet.balance += total_prize_pool
```

#### Wallet Security
- **User Isolation**: Users can only access their own wallet
- **Atomic Operations**: All transactions are atomic
- **Balance Validation**: Prevents negative balances
- **Fund Verification**: Pre-game fund checks

### 3. Game Engine (Ludo Implementation)

#### Game Mechanics

**Board Layout:**
- **Main Track**: 52 positions in a circular layout
- **Start Positions**: [50, 11, 24, 37] for each player color
- **Safe Zones**: [1, 8, 14, 21, 27, 34, 40, 47] where pawns cannot be killed
- **Home Tracks**: 6 positions per player leading to victory
- **Colors**: Red, Green, Blue, Yellow (Player IDs 0, 1, 2, 3)

**Pawn States:**
```python
class PawnState:
    position: int           # -1=barracks, 0-51=board, 52+=home_track
    is_in_barracks: bool   # Starting position
    is_in_yard: bool       # On main board
    is_in_safe_zone: bool  # Protected from capture
    is_in_home_track: bool # Final stretch
    is_finished: bool      # Completed the game
```

**Movement Rules:**

1. **Exiting Barracks:**
   - Must roll exactly 6 to move pawn from barracks to start position
   - Grants extra turn

2. **Normal Movement:**
   - Move clockwise around the 52-position board
   - If land on opponent's pawn (not in safe zone), send it to barracks
   - Killing grants extra turn

3. **Home Track Entry:**
   - When passing home entry position with exact steps
   - Enter home track instead of continuing around board

4. **Finishing:**
   - Reach end of 6-position home track
   - Must land exactly on final position
   - Finishing grants extra turn

5. **Winning:**
   - First player to finish all 4 pawns wins
   - Game ends immediately

**Turn Management:**
```python
class TurnLogic:
    def next_turn(self, current_player, dice_value, action_result):
        extra_turn = (
            dice_value == 6 or           # Rolled a six
            action_result.killed_pawn or # Killed opponent
            action_result.pawn_finished  # Finished a pawn
        )
        
        if extra_turn and consecutive_sixes < 2:
            return current_player  # Same player continues
        else:
            return (current_player + 1) % num_players
```

#### Game States

**Game Level States:**
- `NOT_STARTED`: Game created, waiting to begin
- `IN_PROGRESS`: Active gameplay
- `FINISHED`: Game completed with winner

**Board Level States:**
- `IDLE`: Waiting for player action
- `WAITING_FOR_DICE_ROLL`: Player must roll dice
- `WAITING_FOR_PAWN_MOVE`: Player must select pawn to move
- `FINISHED`: Game over

### 4. Real-Time Communication (WebSocket System)

#### WebSocket Architecture

**Connection Management:**
```python
class ConnectionManager:
    def __init__(self):
        self.client_registry = ClientRegistry()
        self.room_registry = RoomRegistry()
    
    async def connect(self, client):
        # Validate JWT token
        # Register client
        # Enable real-time communication
    
    async def broadcast(self, message, scope):
        # Send to all clients, room, or individual
```

**Client Lifecycle:**
1. **Connection**: Client connects with JWT token
2. **Authentication**: Server validates token and extracts user info
3. **Registration**: Client added to registry
4. **Room Assignment**: Client joins game room
5. **Event Handling**: Real-time message processing
6. **Disconnection**: Clean disconnection and cleanup

#### Message Broadcasting

**Broadcasting Scopes:**

1. **Personal Messages** (`send_to_all: false`):
   - Wallet balance updates
   - Error messages
   - Test responses
   - Sent only to requesting client

2. **Room Broadcasts** (`send_to_all: true`):
   - Game moves and updates
   - Player joins/leaves
   - Dice rolls
   - Game completion
   - Sent to all clients in same room

3. **Global Broadcasts**:
   - New room announcements
   - System-wide notifications
   - Sent to all connected clients

#### Event Processing Flow

```
WebSocket Message Received
         ↓
   Parse JSON Content
         ↓
   Validate Message Format
         ↓
   Extract Event Type
         ↓
   Route to Event Handler
         ↓
   Process Business Logic
         ↓
   Generate Response
         ↓
   Determine Broadcast Scope
         ↓
   Send Response(s)
```

### 5. Room Management System

#### Room Lifecycle

**Room Creation:**
```python
class Room:
    def __init__(self, name, creator, bet_amount):
        self.id = name                    # Room identifier
        self.name = name                  # Display name
        self.creator_id = creator.user_id # Room creator
        self.users = [creator.user_id]    # Player list
        self.bet_amount = bet_amount      # Required bet
        self.game_id = ""                 # Associated game
        self.total_bet_amount = bet_amount # Running total
```

**Room States:**
1. **Waiting**: Room created, accepting players
2. **Full**: Maximum players reached (4)
3. **Game Created**: Game instance generated
4. **Active**: Game in progress
5. **Completed**: Game finished

#### Player Management

**Joining Process:**
1. Client requests to join specific room
2. System validates:
   - Room exists
   - Room not full
   - User has sufficient funds
   - User not already in room
3. Add user to room.users list
4. Update total_bet_amount
5. Broadcast room update to all clients

**Fund Verification:**
```python
async def can_join_room(user_id, bet_amount):
    wallet = await get_wallet(user_id)
    return wallet.balance >= bet_amount
```

## 🔄 Complete Application Flow

### User Onboarding Flow

```
1. User Registration/Login
   ↓
2. JWT Token Received & Stored
   ↓
3. WebSocket Connection Established
   ↓
4. Wallet Auto-Created (1000.0 initial balance)
   ↓
5. User Ready for Game Participation
```

### Game Session Flow

```
1. Room Creation/Discovery
   ├─ User creates room with bet amount
   └─ OR user browses available rooms
   ↓
2. Room Population
   ├─ Players join room (2-4 players)
   ├─ Fund verification for each player
   └─ Room shows player count and total prize
   ↓
3. Game Initialization
   ├─ Room creator starts game creation
   ├─ Game instance created with all room players
   ├─ Board initialized with 4 pawns per player
   └─ Players assigned colors (Red, Green, Blue, Yellow)
   ↓
4. Game Start
   ├─ Bet amounts deducted from all wallets
   ├─ Total prize pool calculated
   ├─ First player determined (Player ID 0)
   └─ Board state: WAITING_FOR_DICE_ROLL
   ↓
5. Gameplay Loop
   ├─ Current player rolls dice
   ├─ System calculates valid moves
   ├─ Player selects pawn to move
   ├─ Move processed (killing, home entry, finishing)
   ├─ Turn advances to next player
   └─ Repeat until winner determined
   ↓
6. Game Completion
   ├─ Winner determined (all pawns finished)
   ├─ Prize pool transferred to winner's wallet
   ├─ Game state updated to FINISHED
   └─ Final game state broadcast to all players
   ↓
7. Session Cleanup
   ├─ Room can be disbanded
   ├─ Players can join new rooms
   └─ Wallet balances reflect results
```

### Technical Data Flow

#### Authentication Flow
```
Frontend                Backend                 Database
   │                      │                       │
   ├─ POST /auth/signup ──┤                       │
   │                      ├─ Hash password ───────┤
   │                      ├─ Store user ──────────┤
   │                      ├─ Generate JWT ────────┤
   │   ← JWT token ──────┤                       │
   │                      │                       │
   ├─ WebSocket connect ─┤                       │
   │   (with JWT header)  ├─ Validate JWT ────────┤
   │                      ├─ Extract user info ───┤
   │   ← Connection OK ───┤                       │
```

#### Game State Synchronization
```
Player 1                Server                Player 2-4
   │                      │                       │
   ├─ roll_dice event ────┤                       │
   │                      ├─ Process dice roll ───┤
   │                      ├─ Update game state ───┤
   │   ← dice result ─────┤                       │
   │                      ├─ Broadcast to all ────┤
   │                      │                   ← dice result
   │                      │                       │
   ├─ move_pawn event ────┤                       │
   │                      ├─ Validate move ───────┤
   │                      ├─ Update positions ────┤
   │                      ├─ Check win condition ─┤
   │   ← move result ─────┤                       │
   │                      ├─ Broadcast to all ────┤
   │                      │                   ← move result
```

## 🗄️ Database Schema

### User Collection
```json
{
  "_id": "ObjectId",
  "uid": "unique_user_id",
  "email": "user@example.com",
  "username": "player123",
  "hashed_password": "$2b$12$...",
  "created_at": "2025-07-05T10:00:00Z",
  "last_login": "2025-07-05T15:30:00Z"
}
```

### Wallet Collection
```json
{
  "_id": "ObjectId",
  "id": "wallet_uuid",
  "user_id": "user_unique_id",
  "balance": 1500.0,
  "created_at": "2025-07-05T10:00:00Z",
  "updated_at": "2025-07-05T15:30:00Z"
}
```

### Game Collection
```json
{
  "_id": "ObjectId",
  "game_id": "game_uuid",
  "user_ids": ["user1", "user2", "user3", "user4"],
  "state": "in_progress",
  "winner_id": null,
  "board": {
    "current_player_id": 1,
    "dice": {"value": 4, "can_roll": false},
    "players": [
      {
        "user_id": "user1",
        "id": 0,
        "color": "red",
        "pawns": [
          {
            "id": 0,
            "position": 15,
            "is_in_yard": true,
            "is_finished": false
          }
        ]
      }
    ]
  },
  "created_at": "2025-07-05T14:00:00Z",
  "completed_at": null
}
```

## 🔧 API Endpoints Summary

### Authentication APIs (`/auth`)
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user info

### Wallet APIs (`/wallet`)
- `POST /wallet/create` - Create user wallet
- `GET /wallet/balance` - Get current balance
- `GET /wallet/` - Get wallet details
- `POST /wallet/add-funds` - Add funds (testing)
- `GET /wallet/sufficient-funds/{amount}` - Check fund availability

### Game APIs (`/games`)
- `POST /games/create` - Create new game
- `POST /games/start` - Start existing game
- `POST /games/roll-dice/{game_id}/{user_id}` - Roll dice
- `POST /games/move-pawn/{game_id}/{user_id}` - Move pawn
- `GET /games/valid-moves/{game_id}/{user_id}` - Get valid moves
- `POST /games/skip-turn/{game_id}/{user_id}` - Skip turn
- `GET /games/{game_id}` - Get game state
- `GET /games/board-info/{game_id}` - Get board layout

### WebSocket Events (`/ws`)
- `register_room` - Create game room
- `join_room` - Join existing room
- `create_game` - Create game from room
- `start_game` - Start the game
- `roll_dice` - Roll dice (real-time)
- `move_pawn` - Move pawn (real-time)
- `get_wallet_balance` - Get balance
- `add_funds` - Add funds
- `test` - Test connection

## 🔒 Security Implementation

### Authentication Security
- **JWT Tokens**: Stateless authentication with 24-hour expiration
- **Password Hashing**: Bcrypt with salt for secure storage
- **Token Validation**: Every request validates JWT signature
- **User Isolation**: Users can only access their own data

### WebSocket Security
- **Connection Authentication**: JWT required for WebSocket connection
- **Message Validation**: All incoming messages validated
- **Room Isolation**: Users only receive messages from their room
- **Error Handling**: Graceful error handling without data exposure

### Financial Security
- **Atomic Transactions**: All wallet operations are atomic
- **Balance Validation**: Prevents negative balances
- **Fund Verification**: Pre-game balance checks
- **User Isolation**: Users cannot access other wallets

### Data Protection
- **Input Validation**: Pydantic models validate all inputs
- **SQL Injection Prevention**: MongoDB ODM prevents injection
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Prevents abuse (can be implemented)

## 🎮 Game Logic Deep Dive

### Dice Mechanics
```python
class Dice:
    def roll(self, player_id):
        value = random.randint(1, 6)
        self.value = value
        self.can_roll = False
        return value
```

### Movement Calculation
```python
def get_next_position(current_pos, steps, player_id):
    if current_pos == -1:  # In barracks
        return start_positions[player_id] if steps == 6 else -1
    
    # Calculate new position with home track entry logic
    new_pos = (current_pos + steps) % 52
    
    # Check for home track entry
    if new_pos == home_entry_positions[player_id]:
        return home_tracks[player_id][0]
    
    return new_pos
```

### Win Condition
```python
def check_win_condition(player):
    finished_pawns = sum(1 for pawn in player.pawns if pawn.is_finished)
    return finished_pawns == 4
```

## 📱 Frontend Integration Guide

### WebSocket Client Implementation
```javascript
class PolyPlayClient {
  constructor(token) {
    this.token = token;
    this.socket = new WebSocket('ws://localhost:8000/ws');
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.socket.onopen = () => {
      console.log('Connected to PolyPlay');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleGameEvent(data);
    };
  }

  sendEvent(event, payload) {
    this.socket.send(JSON.stringify({ event, payload }));
  }
}
```

### Game State Management
```javascript
class GameStateManager {
  constructor() {
    this.gameState = null;
    this.roomState = null;
    this.walletBalance = 0;
  }

  updateGameState(newState) {
    this.gameState = newState;
    this.notifyComponents();
  }

  getCurrentPlayer() {
    return this.gameState?.board?.current_player_id;
  }

  isMyTurn(userId) {
    const currentPlayer = this.getCurrentPlayer();
    const myPlayerIndex = this.gameState?.user_ids?.indexOf(userId);
    return currentPlayer === myPlayerIndex;
  }
}
```

## 🚀 Deployment Architecture

### Development Environment
```yaml
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=dev-secret
      - MONGODB_URL=mongodb://mongo:27017/polyplay
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
      - REACT_APP_WS_URL=ws://localhost:8000
```

### Production Considerations
- **Container Orchestration**: Kubernetes or Docker Swarm
- **Load Balancing**: Nginx or cloud load balancers
- **Database**: MongoDB Atlas with replica sets
- **SSL/TLS**: HTTPS and WSS encryption
- **Environment Variables**: Secure secret management
- **Monitoring**: Application and infrastructure monitoring
- **Scaling**: Horizontal scaling for WebSocket connections

## 📊 Performance Considerations

### WebSocket Optimization
- **Connection Pooling**: Efficient connection management
- **Message Batching**: Reduce message frequency
- **Heartbeat Mechanism**: Keep connections alive
- **Graceful Disconnection**: Clean connection termination

### Database Optimization
- **Indexing**: User ID, game ID, wallet ID indexes
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Efficient data retrieval
- **Caching**: Redis for frequently accessed data

### Scalability Planning
- **Horizontal Scaling**: Multiple server instances
- **Session Stickiness**: WebSocket connection management
- **Database Sharding**: Large user base support
- **CDN Integration**: Static asset delivery

## 🔮 Future Enhancements

### Gameplay Features
- **Tournament Mode**: Multi-round competitions
- **Private Rooms**: Invitation-only games
- **Spectator Mode**: Watch games in progress
- **Game Replay**: Review completed games
- **AI Opponents**: Play against computer

### Social Features
- **Friend System**: Add and play with friends
- **Chat System**: In-game messaging
- **Player Profiles**: Statistics and achievements
- **Leaderboards**: Top players and rankings
- **Social Sharing**: Share victories

### Business Features
- **Payment Integration**: Real money deposits/withdrawals
- **Multiple Currencies**: Support different currencies
- **Rake System**: Platform revenue model
- **VIP Levels**: Premium user tiers
- **Promotions**: Bonuses and rewards

### Technical Improvements
- **Mobile Apps**: Native iOS/Android applications
- **Offline Mode**: Play against AI offline
- **Performance Monitoring**: Real-time metrics
- **A/B Testing**: Feature experimentation
- **Analytics**: User behavior tracking

This comprehensive overview covers every aspect of the PolyPlay application, from high-level architecture to implementation details, providing a complete understanding of how the system works and can be extended.
