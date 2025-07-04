# Wallet API Documentation

This document provides comprehensive documentation for the Wallet API endpoints in the PolyPlay backend system, handling user funds, transactions, and betting functionality.

## Base URL
All wallet endpoints are prefixed with `/wallet`

## Overview

The wallet system manages user funds for betting in PolyPlay games. Key features include:

- **Secure Fund Management**: Each user has a personal wallet with balance tracking
- **Betting Integration**: Automatic deduction and prize distribution
- **Transaction History**: Track all wallet activities (future feature)
- **Initial Balance**: New wallets start with 1000.0 credits
- **Fund Addition**: Add funds for testing/demo purposes

## Authentication

All wallet endpoints require JWT authentication via Bearer token:

```
Authorization: Bearer <jwt_token>
```

The user ID is extracted from the JWT token, ensuring users can only access their own wallet data.

## Data Models

### Wallet Schema
```json
{
  "id": "wallet_unique_id",
  "user_id": "user_unique_id", 
  "balance": 1000.0
}
```

### Common Response Schemas

#### WalletResponse
```json
{
  "success": true,
  "wallet": {
    "id": "wallet_unique_id",
    "user_id": "user_unique_id",
    "balance": 1000.0
  },
  "message": "Operation successful"
}
```

#### BalanceResponse
```json
{
  "success": true,
  "balance": 1000.0,
  "user_id": "user_unique_id"
}
```

#### TransactionResponse
```json
{
  "success": true,
  "message": "Transaction completed successfully",
  "new_balance": 1500.0
}
```

## API Endpoints

### 1. Create Wallet

**Endpoint:** `POST /wallet/create`

**Description:** Create a new wallet for the authenticated user

**Request Body:**
```json
{
  "initial_balance": 1000.0
}
```

**Request Schema:**
- `initial_balance` (float, optional): Starting balance (defaults to 1000.0)

**Response:**
```json
{
  "success": true,
  "wallet": {
    "id": "wallet_abc123",
    "user_id": "user_xyz789",
    "balance": 1000.0
  },
  "message": "Wallet created successfully"
}
```

**Existing Wallet Response:**
```json
{
  "success": true,
  "wallet": {
    "id": "wallet_abc123",
    "user_id": "user_xyz789", 
    "balance": 850.0
  },
  "message": "Wallet already exists"
}
```

**Status Codes:**
- `200`: Wallet created successfully or already exists
- `400`: Invalid request data
- `401`: Unauthorized (invalid token)

**Example cURL:**
```bash
curl -X POST "http://localhost:8000/wallet/create" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"initial_balance": 1500.0}'
```

---

### 2. Get Wallet Balance

**Endpoint:** `GET /wallet/balance`

**Description:** Get the current balance of the user's wallet

**Response:**
```json
{
  "success": true,
  "balance": 850.0,
  "user_id": "user_xyz789"
}
```

**Status Codes:**
- `200`: Balance retrieved successfully
- `400`: Wallet not found or error occurred
- `401`: Unauthorized (invalid token)

**Example cURL:**
```bash
curl -X GET "http://localhost:8000/wallet/balance" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Get Wallet Details

**Endpoint:** `GET /wallet/`

**Description:** Get complete wallet information for the user

**Response:**
```json
{
  "success": true,
  "wallet": {
    "id": "wallet_abc123",
    "user_id": "user_xyz789",
    "balance": 850.0
  },
  "message": "Wallet retrieved successfully"
}
```

**Auto-Creation:** If the user doesn't have a wallet, one will be created automatically with default balance (1000.0)

**Status Codes:**
- `200`: Wallet retrieved successfully
- `400`: Error occurred
- `401`: Unauthorized (invalid token)

**Example cURL:**
```bash
curl -X GET "http://localhost:8000/wallet/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Add Funds

**Endpoint:** `POST /wallet/add-funds`

**Description:** Add funds to the user's wallet (for testing/demo purposes)

**Request Body:**
```json
{
  "amount": 500.0
}
```

**Request Schema:**
- `amount` (float, required): Amount to add (must be positive)

**Response:**
```json
{
  "success": true,
  "message": "Successfully added 500.0 to wallet",
  "new_balance": 1350.0
}
```

**Status Codes:**
- `200`: Funds added successfully
- `400`: Invalid amount (≤ 0) or other error
- `401`: Unauthorized (invalid token)

**Example cURL:**
```bash
curl -X POST "http://localhost:8000/wallet/add-funds" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"amount": 500.0}'
```

---

### 5. Check Sufficient Funds

**Endpoint:** `GET /wallet/sufficient-funds/{amount}`

**Description:** Check if the user has sufficient funds for a specific amount

**Path Parameters:**
- `amount` (float): Amount to check against current balance

**Response (Sufficient Funds):**
```json
{
  "success": true,
  "has_sufficient_funds": true,
  "required_amount": 100.0,
  "current_balance": 850.0,
  "shortfall": 0
}
```

**Response (Insufficient Funds):**
```json
{
  "success": true,
  "has_sufficient_funds": false,
  "required_amount": 1000.0,
  "current_balance": 850.0,
  "shortfall": 150.0
}
```

**Response Schema:**
- `has_sufficient_funds` (boolean): Whether user has enough funds
- `required_amount` (float): Amount being checked
- `current_balance` (float): User's current wallet balance
- `shortfall` (float): Amount missing if insufficient (0 if sufficient)

**Status Codes:**
- `200`: Check completed successfully
- `400`: Error occurred
- `401`: Unauthorized (invalid token)

**Example cURL:**
```bash
curl -X GET "http://localhost:8000/wallet/sufficient-funds/250.0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Wallet Integration with Game System

### Betting Flow

1. **Room Creation/Joining**:
   - User creates room with bet amount
   - System checks if user has sufficient funds
   - Funds are reserved but not deducted until game starts

2. **Game Start**:
   - Bet amounts are deducted from all players' wallets
   - Total prize pool = sum of all players' bets

3. **Game Completion**:
   - Winner receives entire prize pool
   - Automatic wallet credit to winner
   - Transaction recorded

### Example Betting Scenario

```javascript
// 4 players each bet 100.0
// Total prize pool = 400.0

// Before game:
Player1: 1000.0 balance
Player2: 1000.0 balance  
Player3: 1000.0 balance
Player4: 1000.0 balance

// After game start (bets deducted):
Player1: 900.0 balance
Player2: 900.0 balance
Player3: 900.0 balance  
Player4: 900.0 balance

// After Player1 wins:
Player1: 1300.0 balance (900.0 + 400.0 prize)
Player2: 900.0 balance
Player3: 900.0 balance
Player4: 900.0 balance
```

## Internal Wallet Service Methods

The following methods are used internally by the game system but not exposed as HTTP endpoints:

### Deduct Funds
```python
async def deduct_funds(user_id: str, amount: float) -> WalletSchema
```
- Deducts specified amount from user's wallet
- Throws error if insufficient funds
- Used when game starts to collect bets

### Transfer Funds
```python
async def transfer_funds(from_user_id: str, to_user_id: str, amount: float) -> bool
```
- Transfers funds between users
- Used for prize distribution

### Has Sufficient Funds
```python
async def has_sufficient_funds(user_id: str, amount: float) -> bool
```
- Checks if user can afford specified amount
- Used before allowing room creation/joining

## Error Handling

### Common Error Responses

```json
{
  "detail": "Error message description"
}
```

### Error Scenarios

#### Insufficient Funds
```json
{
  "detail": "Insufficient funds. Required: 100.0, Available: 50.0"
}
```

#### Wallet Not Found
```json
{
  "detail": "Wallet not found for user"
}
```

#### Invalid Amount
```json
{
  "detail": "Amount must be positive"
}
```

#### Authentication Errors
```json
{
  "detail": "Invalid token"
}
```

## Frontend Integration

### JavaScript Examples

#### Get Wallet Balance
```javascript
const getWalletBalance = async (token) => {
  try {
    const response = await fetch('/wallet/balance', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
};
```

#### Add Funds
```javascript
const addFunds = async (token, amount) => {
  try {
    const response = await fetch('/wallet/add-funds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amount })
    });
    const data = await response.json();
    return data.new_balance;
  } catch (error) {
    console.error('Error adding funds:', error);
  }
};
```

#### Check Sufficient Funds Before Betting
```javascript
const canAffordBet = async (token, betAmount) => {
  try {
    const response = await fetch(`/wallet/sufficient-funds/${betAmount}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.has_sufficient_funds;
  } catch (error) {
    console.error('Error checking funds:', error);
    return false;
  }
};

// Usage in game lobby
const joinRoom = async (roomId, betAmount) => {
  const canAfford = await canAffordBet(userToken, betAmount);
  if (!canAfford) {
    alert('Insufficient funds for this bet amount');
    return;
  }
  // Proceed with room joining...
};
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const WalletComponent = ({ token }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/wallet/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (amount) => {
    try {
      const response = await fetch('/wallet/add-funds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amount })
      });
      const data = await response.json();
      setBalance(data.new_balance);
    } catch (error) {
      console.error('Error adding funds:', error);
    }
  };

  if (loading) return <div>Loading wallet...</div>;

  return (
    <div className="wallet-component">
      <h3>Wallet</h3>
      <div className="balance">
        Current Balance: ${balance.toFixed(2)}
      </div>
      <div className="actions">
        <button onClick={() => handleAddFunds(100)}>
          Add $100
        </button>
        <button onClick={() => handleAddFunds(500)}>
          Add $500
        </button>
        <button onClick={fetchBalance}>
          Refresh Balance
        </button>
      </div>
    </div>
  );
};

export default WalletComponent;
```

## Security Considerations

### Authentication
- All endpoints require valid JWT token
- User can only access their own wallet data
- Token validation on every request

### Fund Management
- Positive amount validation for all transactions
- Insufficient funds checking before deductions
- Atomic transaction operations

### Data Protection
- Wallet IDs are generated using secure random UUIDs
- Balance precision maintained using float (consider Decimal for production)
- No sensitive financial data exposed

## Testing

### Manual Testing Endpoints

```bash
# 1. Create wallet
curl -X POST "http://localhost:8000/wallet/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"initial_balance": 2000.0}'

# 2. Check balance
curl -X GET "http://localhost:8000/wallet/balance" \
  -H "Authorization: Bearer $TOKEN"

# 3. Add funds
curl -X POST "http://localhost:8000/wallet/add-funds" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 500.0}'

# 4. Check sufficient funds
curl -X GET "http://localhost:8000/wallet/sufficient-funds/1000.0" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get wallet details
curl -X GET "http://localhost:8000/wallet/" \
  -H "Authorization: Bearer $TOKEN"
```

### Test Scenarios

1. **New User Flow**:
   - User signs up
   - Access wallet endpoint (auto-creates wallet)
   - Verify 1000.0 initial balance

2. **Betting Flow**:
   - Check sufficient funds for bet amount
   - Create/join room with bet
   - Play game to completion
   - Verify winner receives prize

3. **Fund Management**:
   - Add various amounts
   - Verify balance updates
   - Test negative amount rejection

4. **Error Handling**:
   - Test with invalid tokens
   - Test insufficient funds scenarios
   - Test invalid amount values

## Future Enhancements

### Transaction History
- Track all wallet activities
- Endpoint: `GET /wallet/transactions`
- Include: timestamp, type, amount, description

### Withdrawal System
- Allow users to withdraw funds
- Endpoint: `POST /wallet/withdraw`
- Include: minimum withdrawal limits, fees

### Multiple Currencies
- Support different currency types
- Currency conversion rates
- Multi-wallet per user

### Payment Integration
- Credit card deposits
- Bank transfers
- Cryptocurrency support

### Audit Trail
- Comprehensive logging
- Transaction verification
- Fraud detection
