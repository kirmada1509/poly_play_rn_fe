# WebSocket API Documentation

This document provides comprehensive documentation for the WebSocket API in the PolyPlay backend system, enabling real-time multiplayer gameplay.

## WebSocket Connection

### Connection Endpoint
**URL:** `ws://localhost:8000/ws`

### Authentication
WebSocket connections require JWT authentication via headers:

```javascript
const token = "your_jwt_token_here";
const socket = new WebSocket(`ws://localhost:8000/ws`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Connection Flow
1. Client connects with JWT token in headers
2. Server validates token and extracts user information
3. Client is registered in the connection manager
4. Real-time event handling begins

## Message Format

### Request Format
All WebSocket messages follow this structure:

```json
{
  "event": "event_name",
  "payload": {
    // Event-specific data
  }
}
```

### Response Format
All WebSocket responses follow this structure:

```json
{
  "success": true,
  "event": "event_name",
  "payload": {
    // Response data
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "event": "event_name",
  "error": "Error message description",
  "payload": null
}
```

## Room Management Events

### 1. Register Room (Create New Room)

**Event:** `register_room`

**Description:** Create a new game room with specified bet amount

**Request:**
```json
{
  "event": "register_room",
  "payload": {
    "room_name": "My Game Room",
    "bet_amount": 100.0
  }
}
```

**Request Payload Schema:**
- `room_name` (string): Name of the room
- `bet_amount` (float): Required bet amount to join (must be > 0)

**Response:**
```json
{
  "success": true,
  "event": "register_room",
  "payload": {
    "room": {
      "id": "My Game Room",
      "name": "My Game Room",
      "creator_id": "user_id",
      "creator_name": "username",
      "users": ["user_id"],
      "game_id": "",
      "bet_amount": 100.0,
      "total_bet_amount": 100.0
    }
  }
}
```

**Broadcast:** Yes (sent to all connected clients)

**Prerequisites:**
- User must have sufficient wallet balance
- User must be authenticated

**Error Scenarios:**
- Insufficient funds in wallet
- Invalid bet amount (≤ 0)
- Room name already exists

---

### 2. Join Room

**Event:** `join_room`

**Description:** Join an existing game room

**Request:**
```json
{
  "event": "join_room",
  "payload": {
    "room_id": "My Game Room"
  }
}
```

**Request Payload Schema:**
- `room_id` (string): ID of the room to join

**Response:**
```json
{
  "success": true,
  "event": "join_room",
  "payload": {
    "room": {
      "id": "My Game Room",
      "name": "My Game Room",
      "creator_id": "creator_user_id",
      "creator_name": "creator_username",
      "users": ["creator_user_id", "joining_user_id"],
      "game_id": "",
      "bet_amount": 100.0,
      "total_bet_amount": 200.0
    }
  }
}
```

**Broadcast:** Yes (sent to all connected clients)

**Prerequisites:**
- Room must exist
- User must have sufficient wallet balance
- User not already in the room

**Error Scenarios:**
- Room not found
- User already in room
- Insufficient funds
- Room full (4 players maximum)

---

## Game Events

### 3. Create Game

**Event:** `create_game`

**Description:** Create a game instance from the current room

**Request:**
```json
{
  "event": "create_game",
  "payload": {}
}
```

**Response:**
```json
{
  "success": true,
  "event": "create_game",
  "payload": {
    "game": {
      "game_id": "unique_game_id",
      "user_ids": ["user1", "user2", "user3", "user4"],
      "board": {
        "dice": {
          "value": 0,
          "can_roll": true,
          "repeated_rolls": 0
        },
        "players": [
          {
            "user_id": "user1",
            "id": 0,
            "color": "red",
            "start_position": 50,
            "pawns": [
              {
                "id": 0,
                "player_id": 0,
                "color": "red",
                "position": -1,
                "is_finished": false,
                "is_in_safe_zone": false,
                "is_in_yard": false,
                "is_in_barracks": true,
                "is_in_home_track": false
              }
              // ... 3 more pawns per player
            ]
          }
          // ... other players
        ],
        "current_player_id": null,
        "state": "idle",
        "colors": ["red", "green", "blue", "yellow"],
        "start_positions": [50, 11, 24, 37],
        "home_start_positions": [51, 12, 25, 38],
        "safe_zones": [1, 8, 14, 21, 27, 34, 40, 47],
        "home_tracks": {
          "0": [52, 53, 54, 55, 56, 57],
          "1": [58, 59, 60, 61, 62, 63],
          "2": [64, 65, 66, 67, 68, 69],
          "3": [70, 71, 72, 73, 74, 75]
        }
      },
      "state": "not_started",
      "winner_id": null
    }
  }
}
```

**Broadcast:** Yes (sent to all room members)

**Prerequisites:**
- User must be in a room
- Room must have at least 2 players

---

### 4. Start Game

**Event:** `start_game`

**Description:** Start the created game and begin gameplay

**Request:**
```json
{
  "event": "start_game",
  "payload": {}
}
```

**Response:**
```json
{
  "success": true,
  "event": "start_game",
  "payload": {
    "game": {
      "game_id": "unique_game_id",
      "user_ids": ["user1", "user2", "user3", "user4"],
      "board": {
        // ... complete board state
        "current_player_id": 0,
        "state": "waiting_for_dice_roll"
      },
      "state": "in_progress",
      "winner_id": null
    }
  }
}
```

**Broadcast:** Yes (sent to all room members)

**Prerequisites:**
- Game must be created
- Game not already started

---

### 5. Roll Dice

**Event:** `roll_dice`

**Description:** Roll dice for the current player's turn

**Request:**
```json
{
  "event": "roll_dice",
  "payload": {}
}
```

**Response:**
```json
{
  "success": true,
  "event": "roll_dice",
  "payload": {
    "rolled_value": 6,
    "rolled_player_id": 0
  }
}
```

**Broadcast:** Yes (sent to all room members)

**Prerequisites:**
- Must be your turn
- Board state must be `waiting_for_dice_roll`
- Game must be in progress

**Game Logic:**
- Dice value is random 1-6
- Board state changes to `waiting_for_pawn_move`
- Rolling 6 may grant extra turn

---

### 6. Move Pawn

**Event:** `move_pawn`

**Description:** Move a specific pawn based on dice roll

**Request:**
```json
{
  "event": "move_pawn",
  "payload": {
    "pawn_id": 0
  }
}
```

**Request Payload Schema:**
- `pawn_id` (integer): Index of pawn to move (0-3)

**Response:**
```json
{
  "success": true,
  "event": "move_pawn",
  "payload": {
    "pawn": {
      "id": 0,
      "player_id": 0,
      "color": "red",
      "position": 51,
      "is_finished": false,
      "is_in_safe_zone": true,
      "is_in_yard": true,
      "is_in_barracks": false,
      "is_in_home_track": false
    },
    "pawns_killed": [
      {
        "id": 4,
        "player_id": 1,
        "color": "green",
        "position": -1,
        "is_finished": false,
        "is_in_safe_zone": false,
        "is_in_yard": false,
        "is_in_barracks": true,
        "is_in_home_track": false
      }
    ],
    "initial_position": 50,
    "final_position": 51,
    "current_player_id": 1,
    "winner_user_id": null,
    "game_completed": false,
    "total_prize": 0
  }
}
```

**Game Completion Response:**
```json
{
  "success": true,
  "event": "move_pawn",
  "payload": {
    "pawn": {
      // ... pawn data
      "is_finished": true
    },
    "pawns_killed": [],
    "initial_position": 74,
    "final_position": 75,
    "current_player_id": 0,
    "winner_user_id": "winning_user_id",
    "game_completed": true,
    "total_prize": 400.0
  }
}
```

**Broadcast:** Yes (sent to all room members)

**Prerequisites:**
- Must be your turn
- Board state must be `waiting_for_pawn_move`
- Pawn must be able to move with current dice value

**Game Logic:**
- Automatic win detection when all pawns finished
- Prize distribution to winner's wallet
- Killing opponent pawns sends them to barracks
- Extra turns for rolling 6, killing, or finishing pawns

---

## Wallet Events

### 7. Get Wallet Balance

**Event:** `get_wallet_balance`

**Description:** Retrieve current wallet balance

**Request:**
```json
{
  "event": "get_wallet_balance",
  "payload": {}
}
```

**Response:**
```json
{
  "success": true,
  "event": "wallet_balance",
  "payload": {
    "balance": 1000.0,
    "user_id": "user_id"
  }
}
```

**Broadcast:** No (personal message only)

---

### 8. Add Funds (Testing/Demo)

**Event:** `add_funds`

**Description:** Add funds to wallet for testing purposes

**Request:**
```json
{
  "event": "add_funds",
  "payload": {
    "amount": 500.0
  }
}
```

**Request Payload Schema:**
- `amount` (float): Amount to add to wallet

**Response:**
```json
{
  "success": true,
  "event": "funds_added",
  "payload": {
    "amount_added": 500.0,
    "new_balance": 1500.0,
    "user_id": "user_id"
  }
}
```

**Broadcast:** No (personal message only)

---

## Test Event

### 9. Test Connection

**Event:** `test`

**Description:** Test WebSocket connection and message handling

**Request:**
```json
{
  "event": "test",
  "payload": {
    "message": "Hello WebSocket!"
  }
}
```

**Response:**
```json
{
  "success": true,
  "event": "test",
  "payload": {
    "received": {
      "event": "test",
      "payload": {
        "message": "Hello WebSocket!"
      },
      "user_id": "user_id",
      "user_name": "username"
    }
  }
}
```

**Broadcast:** No (personal message only)

---

## Connection Management

### Client Registration
- Each WebSocket connection creates a `Client` object
- Client contains: `user_id`, `username`, `websocket`, `room_id`
- Clients are managed in `ClientRegistry`

### Room Assignment
- Clients join rooms through `register_room` or `join_room` events
- Room membership determines message broadcasting scope
- Each client can be in only one room at a time

### Message Broadcasting

#### Personal Messages (`send_to_all: false`)
- Sent only to the requesting client
- Used for: wallet balance, test messages, error responses

#### Room Broadcasts (`send_to_all: true`)
- Sent to all clients in the same room
- Used for: game events, room updates

#### Global Broadcasts
- Sent to all connected clients
- Used for: room registration announcements

## Error Handling

### Connection Errors
```json
{
  "error": "Error handling event: Invalid token"
}
```

### Event Errors
```json
{
  "success": false,
  "event": "roll_dice",
  "error": "Not your turn",
  "payload": null
}
```

### Common Error Scenarios
- **Authentication Failed**: Invalid or expired JWT token
- **Room Not Found**: Attempting to join non-existent room
- **Insufficient Funds**: Not enough wallet balance for bet amount
- **Game Logic Errors**: Invalid moves, wrong turn, etc.
- **Connection Lost**: WebSocket disconnect during gameplay

## Frontend Integration Examples

### JavaScript WebSocket Client

```javascript
class PolyPlayWebSocket {
  constructor(token) {
    this.token = token;
    this.socket = null;
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(`ws://localhost:8000/ws`);
    
    this.socket.onopen = () => {
      console.log('Connected to PolyPlay WebSocket');
      
      // Send authentication after connection
      this.sendEvent('test', { message: 'Connection established' });
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendEvent(eventName, payload) {
    const message = {
      event: eventName,
      payload: payload
    };
    this.socket.send(JSON.stringify(message));
  }

  handleMessage(data) {
    switch(data.event) {
      case 'register_room':
        this.onRoomRegistered(data.payload);
        break;
      case 'join_room':
        this.onRoomJoined(data.payload);
        break;
      case 'roll_dice':
        this.onDiceRolled(data.payload);
        break;
      case 'move_pawn':
        this.onPawnMoved(data.payload);
        break;
      default:
        console.log('Received:', data);
    }
  }

  // Game actions
  registerRoom(roomName, betAmount) {
    this.sendEvent('register_room', {
      room_name: roomName,
      bet_amount: betAmount
    });
  }

  joinRoom(roomId) {
    this.sendEvent('join_room', {
      room_id: roomId
    });
  }

  createGame() {
    this.sendEvent('create_game', {});
  }

  startGame() {
    this.sendEvent('start_game', {});
  }

  rollDice() {
    this.sendEvent('roll_dice', {});
  }

  movePawn(pawnId) {
    this.sendEvent('move_pawn', {
      pawn_id: pawnId
    });
  }

  getWalletBalance() {
    this.sendEvent('get_wallet_balance', {});
  }

  addFunds(amount) {
    this.sendEvent('add_funds', {
      amount: amount
    });
  }

  // Event handlers (implement based on UI needs)
  onRoomRegistered(payload) {
    console.log('Room registered:', payload.room);
    // Update UI with room information
  }

  onRoomJoined(payload) {
    console.log('Room joined:', payload.room);
    // Update UI with updated room information
  }

  onDiceRolled(payload) {
    console.log('Dice rolled:', payload.rolled_value);
    // Update UI with dice value and enable pawn selection
  }

  onPawnMoved(payload) {
    console.log('Pawn moved:', payload);
    // Update board UI with new pawn positions
    // Handle killed pawns animation
    // Check for game completion
    if (payload.game_completed) {
      console.log('Game completed! Winner:', payload.winner_user_id);
      console.log('Prize:', payload.total_prize);
    }
  }
}

// Usage
const token = localStorage.getItem('auth_token');
const gameSocket = new PolyPlayWebSocket(token);

// Register a room
gameSocket.registerRoom('My Game', 100.0);
```

### React Hook Example

```javascript
import { useState, useEffect, useRef } from 'react';

export const usePolyPlayWebSocket = (token) => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/ws`);
    
    ws.onopen = () => {
      setConnectionStatus('connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch(data.event) {
        case 'register_room':
        case 'join_room':
          setRoomState(data.payload.room);
          break;
        case 'create_game':
        case 'start_game':
          setGameState(data.payload.game);
          break;
        case 'roll_dice':
        case 'move_pawn':
          // Update game state based on response
          setGameState(prev => ({
            ...prev,
            board: {
              ...prev.board,
              // Update relevant board state
            }
          }));
          break;
        case 'wallet_balance':
          setWalletBalance(data.payload.balance);
          break;
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  const sendEvent = (eventName, payload) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        event: eventName,
        payload: payload
      }));
    }
  };

  return {
    socket,
    gameState,
    roomState,
    walletBalance,
    connectionStatus,
    sendEvent,
    
    // Convenience methods
    registerRoom: (roomName, betAmount) => 
      sendEvent('register_room', { room_name: roomName, bet_amount: betAmount }),
    joinRoom: (roomId) => 
      sendEvent('join_room', { room_id: roomId }),
    createGame: () => 
      sendEvent('create_game', {}),
    startGame: () => 
      sendEvent('start_game', {}),
    rollDice: () => 
      sendEvent('roll_dice', {}),
    movePawn: (pawnId) => 
      sendEvent('move_pawn', { pawn_id: pawnId }),
    getWalletBalance: () => 
      sendEvent('get_wallet_balance', {}),
    addFunds: (amount) => 
      sendEvent('add_funds', { amount: amount })
  };
};
```

## Best Practices

### Connection Management
1. **Reconnection Logic**: Implement automatic reconnection on disconnect
2. **Heart-beat**: Send periodic ping messages to maintain connection
3. **Token Refresh**: Handle token expiration gracefully

### Message Handling
1. **Event Validation**: Validate all incoming messages before processing
2. **Error Recovery**: Handle error responses appropriately
3. **State Synchronization**: Keep local state in sync with server state

### UI Updates
1. **Optimistic Updates**: Update UI immediately, rollback on error
2. **Animation Queuing**: Queue animations for smooth gameplay experience
3. **Loading States**: Show loading indicators during server communication

### Security
1. **Token Management**: Securely store and transmit JWT tokens
2. **Input Validation**: Validate all user inputs before sending
3. **Rate Limiting**: Implement client-side rate limiting for actions
