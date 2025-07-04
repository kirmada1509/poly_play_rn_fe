# Game API Documentation

This document provides comprehensive documentation for the Game API endpoints in the PolyPlay backend system.

## Base URL
All game endpoints are prefixed with `/games`

## Game Overview

The PolyPlay game system implements a digital version of Ludo (also known as Pachisi) with the following key features:

- **4 Players Maximum**: Each game supports up to 4 players
- **4 Pawns per Player**: Each player has 4 pawns with unique colors (red, green, blue, yellow)
- **52 Board Positions**: Standard Ludo board with 52 main positions
- **Home Tracks**: Each player has a 6-position home track (positions 52-75)
- **Safe Zones**: Specific positions where pawns cannot be killed
- **Betting System**: Players bet money to join games with winner-takes-all prize distribution

## Board Layout

### Position System
- **Main Board**: Positions 0-51 (circular track)
- **Home Tracks**: 
  - Player 0 (Red): Positions 52-57
  - Player 1 (Green): Positions 58-63
  - Player 2 (Blue): Positions 64-67
  - Player 3 (Yellow): Positions 70-75
- **Barracks**: Position -1 (starting position for all pawns)
- **Finished**: Position -2 (game completion marker)

### Key Positions
- **Start Positions**: [50, 11, 24, 37] - Where pawns enter the main board
- **Home Entry Positions**: [51, 12, 25, 38] - Where pawns enter home tracks
- **Safe Zones**: [1, 8, 14, 21, 27, 34, 40, 47] - Protected positions

## Game States

### Game State Enum
- `NOT_STARTED`: Game created but not yet started
- `IN_PROGRESS`: Game is actively being played
- `FINISHED`: Game completed with a winner

### Board State Enum
- `IDLE`: No action required
- `WAITING_FOR_DICE_ROLL`: Waiting for current player to roll dice
- `WAITING_FOR_PAWN_MOVE`: Waiting for current player to move a pawn
- `FINISHED`: Game completed

## API Endpoints

### 1. Create Game

**Endpoint:** `POST /games/create`

**Description:** Create a new game instance with specified players

**Request Body:**
```json
{
  "user_ids": ["user1_id", "user2_id", "user3_id", "user4_id"]
}
```

**Request Schema:**
- `user_ids` (array): List of user IDs (2-4 players)

**Response:**
```json
{
  "game": {
    "game_id": "game_unique_id",
    "user_ids": ["user1_id", "user2_id", "user3_id", "user4_id"],
    "board": {
      "dice": {
        "value": 0,
        "can_roll": true,
        "repeated_rolls": 0
      },
      "players": [
        {
          "user_id": "user1_id",
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
            // ... 3 more pawns
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
```

**Status Codes:**
- `200`: Game created successfully
- `400`: Invalid request data

---

### 2. Start Game

**Endpoint:** `POST /games/start`

**Description:** Start an existing game and set the first player

**Request Body:**
```json
{
  "game_id": "game_unique_id"
}
```

**Response:**
```json
{
  "game": {
    "game_id": "game_unique_id",
    "user_ids": ["user1_id", "user2_id", "user3_id", "user4_id"],
    "board": {
      // ... board data with current_player_id set to 0
      "current_player_id": 0,
      "state": "waiting_for_dice_roll"
    },
    "state": "in_progress",
    "winner_id": null
  }
}
```

**Status Codes:**
- `200`: Game started successfully
- `404`: Game not found
- `400`: Game already started

---

### 3. Roll Dice

**Endpoint:** `POST /games/roll-dice/{game_id}/{user_id}`

**Description:** Roll dice for the current player's turn

**Path Parameters:**
- `game_id` (string): Unique game identifier
- `user_id` (string): ID of the player rolling dice

**Response:**
```json
{
  "rolled_value": 6,
  "rolled_player_id": 0
}
```

**Response Schema:**
- `rolled_value` (integer): Dice value (1-6)
- `rolled_player_id` (integer): Player ID who rolled

**Game Rules:**
- Only the current player can roll dice
- After rolling, board state changes to `WAITING_FOR_PAWN_MOVE`
- Rolling 6 grants an extra turn (up to 2 consecutive 6s)
- Must roll 6 to move pawns out of barracks

**Status Codes:**
- `200`: Dice rolled successfully
- `400`: Not your turn or invalid game state
- `404`: Game or user not found

---

### 4. Move Pawn

**Endpoint:** `POST /games/move-pawn/{game_id}/{user_id}`

**Description:** Move a specific pawn based on the dice roll

**Path Parameters:**
- `game_id` (string): Unique game identifier
- `user_id` (string): ID of the player moving pawn

**Request Body:**
```json
{
  "pawn_id": 0
}
```

**Request Schema:**
- `pawn_id` (integer): Index of the pawn to move (0-3)

**Response:**
```json
{
  "pawn": {
    "id": 0,
    "player_id": 0,
    "color": "red",
    "position": 50,
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
  "initial_position": -1,
  "final_position": 50,
  "current_player_id": 0,
  "winner_user_id": null,
  "game_completed": false,
  "total_prize": 0
}
```

**Response Schema:**
- `pawn`: Updated pawn information
- `pawns_killed`: List of opponent pawns that were killed
- `initial_position`: Starting position before move
- `final_position`: Ending position after move
- `current_player_id`: Next player's turn
- `winner_user_id`: Winner ID if game completed
- `game_completed`: Boolean indicating game completion
- `total_prize`: Prize amount if game completed

**Movement Rules:**
1. **From Barracks (-1)**: Must roll 6 to move to start position
2. **Regular Movement**: Move clockwise around the board
3. **Home Track Entry**: Enter home track when passing home entry position
4. **Killing**: Land on opponent's pawn (not in safe zone) to send it back to barracks
5. **Finishing**: Reach the end of home track to finish the pawn
6. **Winning**: First player to finish all 4 pawns wins

**Extra Turn Conditions:**
- Rolling 6
- Moving pawn out of barracks
- Killing an opponent's pawn
- Finishing a pawn

**Status Codes:**
- `200`: Pawn moved successfully
- `400`: Invalid move, not your turn, or pawn cannot move
- `404`: Game or user not found

---

### 5. Get Valid Moves

**Endpoint:** `GET /games/valid-moves/{game_id}/{user_id}`

**Description:** Get list of pawns that can make valid moves with current dice value

**Path Parameters:**
- `game_id` (string): Unique game identifier
- `user_id` (string): ID of the player requesting valid moves

**Response:**
```json
{
  "valid_moves": [0, 2],
  "dice_value": 6,
  "player_id": 0
}
```

**Response Schema:**
- `valid_moves` (array): List of pawn indices that can move
- `dice_value` (integer): Current dice value
- `player_id` (integer): Player ID

**Status Codes:**
- `200`: Valid moves retrieved successfully
- `400`: No dice rolled or not your turn
- `404`: Game or user not found

---

### 6. Skip Turn

**Endpoint:** `POST /games/skip-turn/{game_id}/{user_id}`

**Description:** Skip turn when no valid moves are available

**Path Parameters:**
- `game_id` (string): Unique game identifier
- `user_id` (string): ID of the player skipping turn

**Response:**
```json
{
  "message": "Turn skipped",
  "next_player_id": 1,
  "skipped_player_id": 0
}
```

**Status Codes:**
- `200`: Turn skipped successfully
- `400`: Valid moves available or not your turn
- `404`: Game or user not found

---

### 7. Get Game State

**Endpoint:** `GET /games/{game_id}`

**Description:** Get current complete game state

**Path Parameters:**
- `game_id` (string): Unique game identifier

**Response:**
```json
{
  "game": {
    "game_id": "game_unique_id",
    "user_ids": ["user1_id", "user2_id", "user3_id", "user4_id"],
    "board": {
      // Complete board state with all players and pawns
    },
    "state": "in_progress",
    "winner_id": null
  }
}
```

**Status Codes:**
- `200`: Game state retrieved successfully
- `404`: Game not found

---

### 8. Get Board Information

**Endpoint:** `GET /games/board-info/{game_id}`

**Description:** Get board layout and configuration information

**Path Parameters:**
- `game_id` (string): Unique game identifier

**Response:**
```json
{
  "board_info": {
    "total_positions": 52,
    "start_positions": [50, 11, 24, 37],
    "home_start_positions": [51, 12, 25, 38],
    "safe_zones": [1, 8, 14, 21, 27, 34, 40, 47],
    "home_tracks": {
      "0": [52, 53, 54, 55, 56, 57],
      "1": [58, 59, 60, 61, 62, 63],
      "2": [64, 65, 66, 67, 68, 69],
      "3": [70, 71, 72, 73, 74, 75]
    },
    "colors": ["red", "green", "blue", "yellow"]
  }
}
```

**Status Codes:**
- `200`: Board info retrieved successfully
- `404`: Game not found

## Game Flow

### Typical Game Sequence

1. **Create Game**: Players join a room and create game
2. **Start Game**: Initialize board and set first player
3. **Roll Dice**: Current player rolls dice
4. **Check Valid Moves**: System determines which pawns can move
5. **Move Pawn**: Player selects and moves a pawn
6. **Process Move**: Handle kills, home track entry, finishing
7. **Determine Next Player**: Check for extra turns or pass to next player
8. **Repeat**: Continue until one player finishes all pawns

### Win Condition

- First player to move all 4 pawns to the finished position wins
- Winner receives the total prize pool from all players' bets

## Error Handling

### Common Error Responses

```json
{
  "detail": "Error message description"
}
```

### Error Scenarios

- **Invalid Move**: Trying to move a pawn that cannot move with current dice value
- **Wrong Turn**: Attempting action when it's not your turn
- **Game Not Found**: Referencing non-existent game ID
- **Game Already Finished**: Trying to play moves in completed game
- **Invalid Pawn ID**: Referencing pawn index outside 0-3 range

## Example Game Workflow

```bash
# 1. Create game
curl -X POST "http://localhost:8000/games/create" \
  -H "Content-Type: application/json" \
  -d '{"user_ids": ["user1", "user2", "user3", "user4"]}'

# 2. Start game
curl -X POST "http://localhost:8000/games/start" \
  -H "Content-Type: application/json" \
  -d '{"game_id": "game_id_here"}'

# 3. Roll dice (first player)
curl -X POST "http://localhost:8000/games/roll-dice/game_id_here/user1"

# 4. Get valid moves
curl -X GET "http://localhost:8000/games/valid-moves/game_id_here/user1"

# 5. Move pawn
curl -X POST "http://localhost:8000/games/move-pawn/game_id_here/user1" \
  -H "Content-Type: application/json" \
  -d '{"pawn_id": 0}'

# 6. Get game state
curl -X GET "http://localhost:8000/games/game_id_here"
```

## Integration Notes

- All game endpoints require authentication via JWT token
- Game state is managed in-memory and persisted to database
- WebSocket events mirror these HTTP endpoints for real-time gameplay
- Wallet integration handles betting and prize distribution automatically
