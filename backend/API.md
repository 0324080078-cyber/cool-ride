# CoolRides API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user (passenger or rider)

**Request Body:**
```json
{
  "phone": "+233XXXXXXXXX",
  "email": "user@example.com",
  "password": "password123",
  "userType": "passenger",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "userId": "uuid",
    "phone": "+233XXXXXXXXX",
    "userType": "passenger"
  },
  "message": "OTP sent to your phone"
}
```

#### POST /auth/login
Login with phone/email and password

**Request Body:**
```json
{
  "phone": "+233XXXXXXXXX",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "phone": "+233XXXXXXXXX",
      "userType": "passenger"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /auth/verify-otp
Verify OTP sent during registration

**Request Body:**
```json
{
  "phone": "+233XXXXXXXXX",
  "otp": "123456"
}
```

#### POST /auth/refresh-token
Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### Users

#### GET /users/profile
Get current user profile (Protected)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "phone": "+233XXXXXXXXX",
    "email": "user@example.com",
    "userType": "passenger",
    "profile": {
      "fullName": "John Doe",
      "rating": 4.8,
      "totalTrips": 25
    }
  }
}
```

#### PUT /users/profile
Update user profile (Protected)

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "newemail@example.com",
  "emergencyContact": "+233XXXXXXXXX",
  "emergencyContactName": "Jane Doe"
}
```

### Trips

#### POST /trips/estimate
Get fare estimate

**Request Body:**
```json
{
  "pickupLocation": {
    "lat": 6.6119,
    "lng": 0.4699
  },
  "dropoffLocation": {
    "lat": 6.6200,
    "lng": 0.4800
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "estimatedFare": 8.50,
    "distance": 2.5,
    "duration": 10,
    "isDayRate": true,
    "breakdown": {
      "baseFare": 3.00,
      "distanceCharge": 1.25,
      "timeCharge": 2.00,
      "surgeMultiplier": 1.0
    }
  }
}
```

#### POST /trips
Create a new trip (Passenger only, Protected)

**Request Body:**
```json
{
  "pickupLocation": {
    "lat": 6.6119,
    "lng": 0.4699
  },
  "pickupAddress": "Ho Technical University",
  "dropoffLocation": {
    "lat": 6.6200,
    "lng": 0.4800
  },
  "dropoffAddress": "Ho Market Circle",
  "estimatedFare": 8.50,
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tripId": "uuid",
    "status": "pending",
    "estimatedFare": 8.50,
    "pickupAddress": "Ho Technical University",
    "dropoffAddress": "Ho Market Circle"
  }
}
```

#### GET /trips/:tripId
Get trip details (Protected)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "status": "in-progress",
    "passenger": {
      "name": "John Doe",
      "phone": "+233XXXXXXXXX",
      "rating": 4.8
    },
    "rider": {
      "name": "Driver Name",
      "phone": "+233XXXXXXXXX",
      "rating": 4.9,
      "vehicle": {
        "type": "Keke",
        "color": "Yellow",
        "plateNumber": "GH-123-45"
      }
    },
    "pickupAddress": "Ho Technical University",
    "dropoffAddress": "Ho Market Circle",
    "estimatedFare": 8.50,
    "actualFare": 8.50,
    "startTime": "2024-12-09T10:30:00Z",
    "endTime": null
  }
}
```

#### PATCH /trips/:tripId/status
Update trip status (Protected)

**Request Body:**
```json
{
  "status": "accepted",
  "riderId": "uuid"
}
```

#### POST /trips/:tripId/cancel
Cancel a trip (Protected)

**Request Body:**
```json
{
  "reason": "Changed plans"
}
```

#### POST /trips/:tripId/rate
Rate a completed trip (Protected)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great ride!"
}
```

### Riders

#### GET /riders/nearby
Get nearby available riders

**Query Parameters:**
- `lat` - Latitude
- `lng` - Longitude
- `radius` - Search radius in km (default: 5)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Driver Name",
      "rating": 4.9,
      "totalTrips": 500,
      "vehicle": {
        "type": "Keke",
        "color": "Yellow"
      },
      "location": {
        "lat": 6.6119,
        "lng": 0.4699
      },
      "distance": 0.5
    }
  ]
}
```

#### POST /riders/location
Update rider location (Rider only, Protected)

**Request Body:**
```json
{
  "lat": 6.6119,
  "lng": 0.4699
}
```

#### POST /riders/toggle-status
Toggle online/offline status (Rider only, Protected)

**Request Body:**
```json
{
  "isOnline": true
}
```

#### GET /riders/earnings
Get rider earnings (Rider only, Protected)

**Query Parameters:**
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalEarnings": 1500.00,
    "trips": 75,
    "averagePerTrip": 20.00,
    "breakdown": {
      "fares": 1875.00,
      "platformFee": -375.00,
      "bonuses": 0.00
    }
  }
}
```

### Payments

#### POST /payments/initiate
Initiate a payment (Protected)

**Request Body:**
```json
{
  "tripId": "uuid",
  "amount": 8.50,
  "method": "momo",
  "provider": "mtn"
}
```

#### POST /payments/verify
Verify payment status (Protected)

**Request Body:**
```json
{
  "transactionId": "transaction_id"
}
```

#### GET /payments/history
Get payment history (Protected)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

## WebSocket Events

Connect to: `ws://localhost:5000`

### Client Events

#### `join`
Join user's personal room
```json
{
  "userId": "uuid"
}
```

#### `rider:online`
Rider goes online
```json
{
  "riderId": "uuid"
}
```

#### `rider:offline`
Rider goes offline
```json
{
  "riderId": "uuid"
}
```

#### `location:update`
Update location
```json
{
  "userId": "uuid",
  "location": {
    "lat": 6.6119,
    "lng": 0.4699
  }
}
```

### Server Events

#### `location:updated`
Receive location update
```json
{
  "lat": 6.6119,
  "lng": 0.4699,
  "timestamp": "2024-12-09T10:30:00Z"
}
```

#### `trip:status`
Receive trip status update
```json
{
  "tripId": "uuid",
  "status": "accepted",
  "rider": {
    "name": "Driver Name",
    "phone": "+233XXXXXXXXX"
  }
}
```

#### `trip:request`
New trip request (for riders)
```json
{
  "tripId": "uuid",
  "passenger": {
    "name": "John Doe",
    "rating": 4.8
  },
  "pickup": {
    "lat": 6.6119,
    "lng": 0.4699,
    "address": "Ho Technical University"
  },
  "dropoff": {
    "lat": 6.6200,
    "lng": 0.4800,
    "address": "Ho Market Circle"
  },
  "estimatedFare": 8.50
}
```

## Error Responses

All errors follow this format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Common Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes

## Pagination

Paginated endpoints support these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```
