# [API Name]

API documentation and usage guide.

## Base URL

```
https://api.example.com/v1
```

## Authentication

API uses Bearer token authentication:

```bash
Authorization: Bearer <your_token>
```

## Endpoints

### GET /users

Get list of users.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |

#### Response

```json
{
  "users": [],
  "total": 0,
  "page": 1
}
```

### POST /users

Create new user.

#### Request Body

```json
{
  "name": "string",
  "email": "string",
  "role": "string"
}
```

## Rate Limiting

- 100 requests per minute
- 1000 requests per hour

## Error Codes

| Code | Description |
|------|-------------|
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |

## SDK Examples

```javascript
const api = new API('your_token');
const users = await api.getUsers();
``` 