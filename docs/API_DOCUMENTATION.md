# PuzzleBITE API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URLs](#base-urls)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Overview

The PuzzleBITE API provides endpoints for managing the gamified dining experience platform. It supports customer puzzle gameplay, admin management, analytics, and live feed functionality.

### API Version
- **Current Version**: v1
- **Protocol**: HTTPS
- **Format**: JSON
- **Authentication**: Bearer Token

---

## Authentication

### Bearer Token Authentication
All API requests require a valid bearer token in the Authorization header.

```http
Authorization: Bearer <your-token-here>
```

### Token Types
- **Customer Token**: Access to puzzle gameplay and personal stats
- **Admin Token**: Full access to management and analytics
- **Cafe Token**: Limited access to cafe-specific data

---

## Base URLs

### Production
```
https://api.puzzlebite.com/v1
```

### Staging
```
https://staging-api.puzzlebite.com/v1
```

### Development
```
https://dev-api.puzzlebite.com/v1
```

---

## API Endpoints

### 🎯 Puzzle Management

#### Get Puzzle Categories
```http
GET /puzzles/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ipl",
      "name": "IPL",
      "description": "Cricket & Sports",
      "icon": "trophy",
      "color": "#F97316",
      "difficulty": 3,
      "totalQuestions": 50
    }
  ]
}
```

#### Get Category Questions
```http
GET /puzzles/categories/{categoryId}/questions
```

**Parameters:**
- `categoryId` (string): Category identifier
- `limit` (integer, optional): Number of questions (default: 5)
- `difficulty` (string, optional): easy, medium, hard

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": 1,
        "question": "Who holds the record for highest individual score in Test cricket?",
        "options": ["Virat Kohli", "Sachin Tendulkar", "Karun Nair", "Rohit Sharma"],
        "correctAnswer": 2,
        "difficulty": "medium",
        "category": "ipl"
      }
    ],
    "timeLimit": 120,
    "totalQuestions": 5
  }
}
```

#### Submit Puzzle Answers
```http
POST /puzzles/submit
```

**Request Body:**
```json
{
  "categoryId": "ipl",
  "answers": [2, 1, 0, 2, 1],
  "timeSpent": 95,
  "customerId": "customer_123",
  "cafeId": "cafe_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 5,
    "totalQuestions": 5,
    "accuracy": 100,
    "timeSpent": 95,
    "passed": true,
    "rewardEligible": true,
    "rewardId": "reward_789"
  }
}
```

### 🎁 Offers & Rewards

#### Get Available Offers
```http
GET /offers
```

**Query Parameters:**
- `cafeId` (string, optional): Filter by cafe
- `active` (boolean, optional): Only active offers
- `category` (string, optional): Filter by offer category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "offer_123",
      "title": "Morning Special",
      "description": "Get 20% off on breakfast items",
      "discount": "20%",
      "discountType": "percentage",
      "discountValue": 20,
      "isActive": true,
      "validUntil": "2025-01-31T23:59:59Z",
      "cafeId": "cafe_456",
      "requiredCategory": "ipl",
      "image": "https://example.com/offer.jpg"
    }
  ]
}
```

#### Activate Offer
```http
POST /offers/{offerId}/activate
```

**Request Body:**
```json
{
  "customerId": "customer_123",
  "tableNumber": "T-05"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activationId": "activation_789",
    "status": "pending",
    "expiresAt": "2025-01-15T14:30:00Z",
    "puzzleRequired": true,
    "categoryId": "ipl"
  }
}
```

#### Redeem Reward
```http
POST /rewards/redeem
```

**Request Body:**
```json
{
  "rewardId": "reward_789",
  "customerId": "customer_123",
  "cafeId": "cafe_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemptionId": "redemption_101",
    "status": "approved",
    "discountApplied": 20,
    "finalAmount": 80,
    "redeemedAt": "2025-01-15T12:30:00Z"
  }
}
```

### 👥 Customer Management

#### Get Customer Profile
```http
GET /customers/{customerId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "customer_123",
    "name": "John Doe",
    "email": "john@example.com",
    "stats": {
      "totalSaved": 245,
      "offersAvailed": 8,
      "puzzlesCompleted": 12,
      "successRate": 85
    },
    "preferences": {
      "favoriteCategories": ["ipl", "bollywood"],
      "theme": "dark"
    },
    "lastVisit": "2025-01-14T10:30:00Z"
  }
}
```

#### Update Customer Stats
```http
PUT /customers/{customerId}/stats
```

**Request Body:**
```json
{
  "puzzleCompleted": true,
  "category": "ipl",
  "score": 5,
  "timeSpent": 95,
  "rewardEarned": 20
}
```

### 🏪 Admin Management

#### Get Active Users
```http
GET /admin/users/active
```

**Query Parameters:**
- `cafeId` (string): Cafe identifier
- `status` (string, optional): pending, approved, completed

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "customer_123",
      "name": "John Doe",
      "tableNumber": "T-05",
      "requestTime": "2025-01-15T10:30:00Z",
      "offerRequested": "Morning Special",
      "status": "pending",
      "puzzleCompleted": false,
      "category": "ipl"
    }
  ]
}
```

#### Approve Customer Request
```http
POST /admin/approve
```

**Request Body:**
```json
{
  "customerId": "customer_123",
  "activationId": "activation_789",
  "approved": true,
  "pbItem": "Latte + Croissant",
  "pbDiscount": "20%"
}
```

#### Get Analytics
```http
GET /admin/analytics
```

**Query Parameters:**
- `period` (string): today, week, month
- `cafeId` (string): Cafe identifier
- `metric` (string, optional): footfall, conversion, revenue

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "today",
    "metrics": {
      "footfall": 45,
      "conversions": 35,
      "conversionRate": 77.8,
      "totalDiscounts": 1240,
      "puzzleSuccessRate": 92,
      "avgEngagementTime": 4.2,
      "peakHour": "14:00"
    },
    "trends": {
      "footfallChange": 12.5,
      "conversionChange": 8.3,
      "revenueChange": -2.1
    }
  }
}
```

### 📸 Live Feed

#### Get Feed Posts
```http
GET /feed
```

**Query Parameters:**
- `cafeId` (string, optional): Filter by cafe
- `limit` (integer, optional): Number of posts (default: 20)
- `offset` (integer, optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "post_123",
      "imageUrl": "https://images.pexels.com/photos/1833306.jpeg",
      "cafeName": "Brew & Bite",
      "cafeLocation": "Downtown",
      "instagramHandle": "@brewandbite_cafe",
      "likes": 24,
      "description": "Fresh baked croissants with our signature coffee blend",
      "uploadTime": "2025-01-15T08:30:00Z",
      "isLiked": false
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Upload Feed Image
```http
POST /feed/upload
```

**Request Body (multipart/form-data):**
```
image: [file]
cafeId: cafe_456
description: Fresh morning pastries
```

**Response:**
```json
{
  "success": true,
  "data": {
    "postId": "post_124",
    "imageUrl": "https://cdn.puzzlebite.com/images/post_124.jpg",
    "uploadedAt": "2025-01-15T09:00:00Z",
    "status": "published"
  }
}
```

#### Like/Unlike Post
```http
POST /feed/{postId}/like
```

**Request Body:**
```json
{
  "customerId": "customer_123",
  "action": "like"
}
```

### 📊 Statistics & Charts

#### Get Chart Data
```http
GET /stats/charts/{type}
```

**Parameters:**
- `type` (string): saved, offers, puzzles, footfall, conversion, discounts, success
- `period` (string): day, week, month
- `cafeId` (string, optional): Filter by cafe

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "bar",
    "title": "Money Saved Over Time",
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "datasets": [
      {
        "data": [12, 25, 18, 35, 42, 28, 45],
        "color": "#A855F7"
      }
    ],
    "insights": [
      "Highest performance on weekends",
      "23% increase from last period",
      "Peak activity between 2-4 PM"
    ]
  }
}
```

---

## Data Models

### Customer
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "stats": {
    "totalSaved": "number",
    "offersAvailed": "number",
    "puzzlesCompleted": "number",
    "successRate": "number"
  },
  "preferences": {
    "favoriteCategories": ["string"],
    "theme": "string",
    "notifications": "boolean"
  },
  "createdAt": "datetime",
  "lastVisit": "datetime"
}
```

### Puzzle Question
```json
{
  "id": "number",
  "question": "string",
  "options": ["string"],
  "correctAnswer": "number",
  "difficulty": "string",
  "category": "string",
  "explanation": "string",
  "tags": ["string"]
}
```

### Offer
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "discountType": "percentage|fixed|freeItem",
  "discountValue": "number",
  "isActive": "boolean",
  "validFrom": "datetime",
  "validUntil": "datetime",
  "cafeId": "string",
  "requiredCategory": "string",
  "maxRedemptions": "number",
  "currentRedemptions": "number",
  "image": "string"
}
```

### Feed Post
```json
{
  "id": "string",
  "imageUrl": "string",
  "cafeName": "string",
  "cafeLocation": "string",
  "instagramHandle": "string",
  "description": "string",
  "likes": "number",
  "uploadTime": "datetime",
  "isActive": "boolean",
  "tags": ["string"]
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request parameters are invalid",
    "details": {
      "field": "categoryId",
      "reason": "Category not found"
    }
  },
  "timestamp": "2025-01-15T12:00:00Z",
  "requestId": "req_123456"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Bad request parameters |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `PUZZLE_TIMEOUT` | 422 | Puzzle time limit exceeded |
| `OFFER_EXPIRED` | 422 | Offer no longer valid |
| `ALREADY_REDEEMED` | 422 | Reward already claimed |

---

## Rate Limiting

### Limits by Endpoint Type

| Endpoint Type | Requests per Minute | Burst Limit |
|---------------|-------------------|-------------|
| Puzzle Gameplay | 30 | 50 |
| Feed Operations | 60 | 100 |
| Analytics | 20 | 30 |
| Admin Operations | 100 | 150 |
| File Uploads | 10 | 15 |

### Rate Limit Headers
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642248000
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

---

## Webhooks

### Puzzle Completion
```http
POST {webhook_url}
Content-Type: application/json
X-PuzzleBite-Signature: sha256=...

{
  "event": "puzzle.completed",
  "data": {
    "customerId": "customer_123",
    "categoryId": "ipl",
    "score": 5,
    "timeSpent": 95,
    "rewardEligible": true
  },
  "timestamp": "2025-01-15T12:00:00Z"
}
```

### Offer Activation
```http
POST {webhook_url}
Content-Type: application/json
X-PuzzleBite-Signature: sha256=...

{
  "event": "offer.activated",
  "data": {
    "customerId": "customer_123",
    "offerId": "offer_123",
    "cafeId": "cafe_456",
    "tableNumber": "T-05"
  },
  "timestamp": "2025-01-15T12:00:00Z"
}
```

---

## SDK Examples

### JavaScript/Node.js
```javascript
const PuzzleBiteAPI = require('@puzzlebite/api-client');

const client = new PuzzleBiteAPI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get puzzle categories
const categories = await client.puzzles.getCategories();

// Submit puzzle answers
const result = await client.puzzles.submit({
  categoryId: 'ipl',
  answers: [2, 1, 0, 2, 1],
  customerId: 'customer_123'
});
```

### Python
```python
from puzzlebite import PuzzleBiteClient

client = PuzzleBiteClient(
    api_key='your-api-key',
    environment='production'
)

# Get available offers
offers = client.offers.list(cafe_id='cafe_456')

# Activate offer
activation = client.offers.activate(
    offer_id='offer_123',
    customer_id='customer_123',
    table_number='T-05'
)
```

---

*Last Updated: January 2025*
*API Version: 1.0.0*