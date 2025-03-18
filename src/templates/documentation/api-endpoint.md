# API Endpoint: [Endpoint Name]

## Overview

Brief description of what this endpoint does.

**URL**: `/api/v1/endpoint`
**Method**: `GET`
**Auth required**: Yes/No

## Request

### Headers

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Parameters

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Resource identifier |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filter` | string | No | Filter results |
| `page` | number | No | Page number |

#### Request Body

```json
{
  "field1": "string",
  "field2": "number",
  "field3": {
    "nested": "object"
  }
}
```

## Response

### Success Response

**Code**: `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "123",
    "name": "Example"
  }
}
```

### Error Responses

#### 400 Bad Request

```json
{
  "status": "error",
  "message": "Invalid parameters",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

#### 401 Unauthorized

```json
{
  "status": "error",
  "message": "Authentication required"
}
```

## Examples

### cURL

```bash
curl -X GET \
  'https://api.example.com/v1/endpoint?filter=value' \
  -H 'Authorization: Bearer token123'
```

### JavaScript

```javascript
const response = await fetch('https://api.example.com/v1/endpoint', {
  headers: {
    'Authorization': 'Bearer token123'
  }
});
const data = await response.json();
```

## Notes

- Rate limit: 100 requests per minute
- Cached for 5 minutes
- Requires scope: `read:items` 