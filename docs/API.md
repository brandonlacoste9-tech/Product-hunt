# 🔌 API Documentation

## Overview

The Product Discovery Hub API provides RESTful endpoints for accessing products, categories, events, and more. All endpoints return JSON responses.

**Base URL**: `https://yourdomain.com/api`

## Authentication

Most read endpoints are public. Write endpoints require authentication via NextAuth.js session cookies or API keys.

### API Key Authentication

Include your API key in the request header:
```
X-API-Key: your_api_key_here
```

## Rate Limiting

- **Anonymous**: 60 requests per minute
- **Authenticated**: 300 requests per minute
- **Premium**: 1000 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1234567890
```

## Endpoints

### Products

#### GET /api/products

List all approved products with filtering and pagination.

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| q | string | Search query | - |
| category | string | Category ID | - |
| region | string | Region code (US, CA, MX) | - |
| pricingType | string | FREE, FREEMIUM, PAID, SUBSCRIPTION, ONE_TIME | - |
| page | number | Page number (1-based) | 1 |
| limit | number | Results per page (max 100) | 20 |
| orderBy | string | votes, date, name | votes |
| order | string | asc, desc | desc |

**Example Request:**
```bash
GET /api/products?category=ai-ml&region=US&page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "name": "AI Content Studio",
      "tagline": "Create stunning content with AI",
      "description": "Full description...",
      "website": "https://aicontentstudio.com",
      "logo": "https://example.com/logo.png",
      "category": {
        "id": "cat123",
        "name": "AI & ML",
        "slug": "ai-ml",
        "icon": "🤖"
      },
      "maker": {
        "id": "user123",
        "name": "Alex Johnson",
        "image": "https://example.com/avatar.jpg"
      },
      "tags": ["ai", "content", "writing"],
      "status": "APPROVED",
      "featured": true,
      "pricingType": "FREEMIUM",
      "region": "US",
      "votesCount": 234,
      "commentsCount": 45,
      "viewsCount": 1200,
      "launchDate": "2024-02-28T00:00:00Z",
      "createdAt": "2024-02-20T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

#### GET /api/products/:id

Get detailed information about a specific product.

**Example Request:**
```bash
GET /api/products/clx1234567890
```

**Example Response:**
```json
{
  "data": {
    "id": "clx1234567890",
    "name": "AI Content Studio",
    "tagline": "Create stunning content with AI",
    "description": "Full description...",
    "website": "https://aicontentstudio.com",
    "category": {
      "id": "cat123",
      "name": "AI & ML",
      "slug": "ai-ml"
    },
    "maker": {
      "id": "user123",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "bio": "Building the future of AI",
      "website": "https://alexjohnson.com",
      "twitter": "@alexjohnson"
    },
    "votes": [
      {
        "userId": "user456",
        "createdAt": "2024-02-28T10:30:00Z"
      }
    ],
    "comments": [
      {
        "id": "comment123",
        "content": "Great product!",
        "user": {
          "id": "user456",
          "name": "Jane Doe",
          "image": "https://example.com/jane.jpg"
        },
        "createdAt": "2024-02-28T11:00:00Z"
      }
    ],
    "votesCount": 234,
    "commentsCount": 45,
    "viewsCount": 1201
  }
}
```

### Categories

#### GET /api/categories

List all product categories.

**Example Request:**
```bash
GET /api/categories
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "cat123",
      "name": "AI & Machine Learning",
      "slug": "ai-ml",
      "description": "Artificial intelligence and ML products",
      "icon": "🤖",
      "color": "#3B82F6",
      "order": 1
    },
    {
      "id": "cat124",
      "name": "Productivity",
      "slug": "productivity",
      "description": "Tools to boost your productivity",
      "icon": "⚡",
      "color": "#10B981",
      "order": 2
    }
  ]
}
```

### Events

#### GET /api/events

List upcoming events.

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| limit | number | Number of events (max 50) | 10 |

**Example Request:**
```bash
GET /api/events?limit=10
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "event123",
      "title": "Product Launch Summit 2024",
      "description": "Join us for...",
      "startDate": "2024-03-15T14:00:00Z",
      "endDate": "2024-03-15T16:00:00Z",
      "location": null,
      "virtual": true,
      "eventUrl": "https://summit.producthub.com",
      "region": "US",
      "city": null,
      "timezone": "America/New_York",
      "image": "https://example.com/event.jpg",
      "products": [
        {
          "id": "prod123",
          "name": "AI Content Studio",
          "tagline": "Create stunning content",
          "category": {
            "name": "AI & ML",
            "icon": "🤖"
          }
        }
      ]
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 501 | Not Implemented - Endpoint under development |

## Examples

### JavaScript/Node.js

```javascript
// Fetch products
const response = await fetch('https://api.producthub.com/api/products?region=US&limit=10')
const data = await response.json()

console.log(data.data) // Array of products
console.log(data.meta) // Pagination info
```

### Python

```python
import requests

# Fetch products
response = requests.get(
    'https://api.producthub.com/api/products',
    params={'region': 'US', 'limit': 10}
)
data = response.json()

print(data['data'])  # List of products
print(data['meta'])  # Pagination info
```

### cURL

```bash
# Fetch products
curl -X GET "https://api.producthub.com/api/products?region=US&limit=10" \
  -H "Accept: application/json"

# With API key
curl -X GET "https://api.producthub.com/api/products" \
  -H "X-API-Key: your_api_key" \
  -H "Accept: application/json"
```

## Webhooks

Subscribe to real-time events (Premium feature):

### Available Events

- `product.created` - New product submitted
- `product.approved` - Product approved by admin
- `product.updated` - Product information updated
- `product.voted` - Product received a vote
- `event.created` - New event created
- `event.starting` - Event starting in 1 hour

### Webhook Payload Example

```json
{
  "event": "product.approved",
  "timestamp": "2024-02-28T12:00:00Z",
  "data": {
    "id": "prod123",
    "name": "AI Content Studio",
    "maker": {
      "id": "user123",
      "email": "alex@example.com"
    }
  }
}
```

## SDKs

Official SDKs coming soon:

- JavaScript/TypeScript
- Python
- Ruby
- PHP
- Go

## Support

- API Status: https://status.producthub.com
- Documentation: https://docs.producthub.com
- Support Email: api@producthub.com
- GitHub: https://github.com/brandonlacoste9-tech/Product-hunt

## Changelog

### v1.0.0 (2024-02-28)
- Initial API release
- Products, Categories, and Events endpoints
- Rate limiting
- API key authentication

---

**Note**: This API is under active development. Breaking changes will be communicated via email and the changelog.
