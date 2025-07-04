# Authentication API Documentation

This document describes the authentication endpoints for the PolyPlay backend API.

## Base URL
All authentication endpoints are prefixed with `/auth`

## Endpoints

### 1. User Registration (Signup)

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Request Schema:**
- `email` (string, required): Valid email address (EmailStr)
- `username` (string, required): Unique username
- `password` (string, required): User password

**Response:**
```json
{
  "user": {
    "uid": "user-unique-id",
    "email": "user@example.com",
    "username": "username"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Schema:**
- `user` (object): User information
  - `uid` (string): Unique user identifier
  - `email` (string): User's email address
  - `username` (string): User's username
- `access_token` (string): JWT token for authentication

**Status Codes:**
- `200`: Successful registration
- `400`: Invalid request data
- `422`: Validation error

**Example cURL:**
```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "newuser",
    "password": "securepassword123"
  }'
```

---

### 2. User signin

**Endpoint:** `POST /auth/signin`

**Description:** Authenticate user and receive access token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Request Schema:**
- `email` (string, required): User's email address (EmailStr)
- `password` (string, required): User's password

**Response:**
```json
{
  "user": {
    "uid": "user-unique-id",
    "email": "user@example.com",
    "username": "username"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Schema:**
- `user` (object): User information
  - `uid` (string): Unique user identifier
  - `email` (string): User's email address
  - `username` (string): User's username
- `access_token` (string): JWT token for authentication

**Status Codes:**
- `200`: Successful signin
- `401`: Invalid credentials or email not found
- `400`: Invalid request data
- `422`: Validation error

**Example cURL:**
```bash
curl -X POST "http://localhost:8000/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get current authenticated user information

**Headers:**
- `Authorization` (required): Bearer token
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

**Response:**
```json
{
  "uid": "user-unique-id",
  "email": "user@example.com",
  "username": "username"
}
```

**Response Schema:**
- `uid` (string): Unique user identifier
- `email` (string): User's email address
- `username` (string): User's username

**Status Codes:**
- `200`: Successful retrieval
- `401`: Invalid or missing token
- `403`: Forbidden

**Example cURL:**
```bash
curl -X GET "http://localhost:8000/auth/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Authentication Flow

1. **Registration**: Use `/auth/signup` to create a new user account
2. **signin**: Use `/auth/signin` to authenticate and receive an access token
3. **Protected Requests**: Include the access token in the `Authorization` header as `Bearer <token>` for all protected endpoints
4. **User Info**: Use `/auth/me` to get current user information

## JWT Token Details

- **Algorithm**: HS256
- **Expiration**: 24 hours (1 day) from issue time
- **Payload includes**:
  - `uid`: User unique identifier
  - `username`: User's username
  - `exp`: Expiration timestamp

## Security Notes

- Passwords are hashed using bcrypt
- Tokens expire after 24 hours
- All endpoints validate request data using Pydantic models
- Email validation ensures proper email format

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "detail": "Error message description"
}
```

Common error scenarios:
- Missing required fields
- Invalid email format
- Duplicate username/email (handled gracefully in signup)
- Invalid credentials
- Expired or invalid JWT tokens

## Environment Variables

The authentication system uses the following environment variables:

- `SECRET_KEY`: JWT signing secret (defaults to "super-secret" if not set)
- Database connection variables (as configured in the application)

**Note**: In production, ensure `SECRET_KEY` is set to a strong, randomly generated secret.