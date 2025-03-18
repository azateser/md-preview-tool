# Database Schema: [Database Name]

## Overview

Description of the database's purpose and design philosophy.

## Tables

### Table: `users`

Stores user information.

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `email` | `varchar(255)` | No | - | User's email address |
| `password_hash` | `varchar(255)` | No | - | Hashed password |
| `created_at` | `timestamp` | No | `CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `timestamp` | No | `CURRENT_TIMESTAMP` | Last update timestamp |

#### Indexes

- `users_pkey` - Primary key on (`id`)
- `users_email_idx` - Unique index on (`email`)

#### Foreign Keys

None

### Table: `posts`

Stores blog posts.

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `user_id` | `uuid` | No | - | Author's user ID |
| `title` | `varchar(255)` | No | - | Post title |
| `content` | `text` | No | - | Post content |
| `status` | `post_status` | No | `'draft'` | Publication status |
| `created_at` | `timestamp` | No | `CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `timestamp` | No | `CURRENT_TIMESTAMP` | Last update timestamp |

#### Indexes

- `posts_pkey` - Primary key on (`id`)
- `posts_user_id_idx` - Index on (`user_id`)
- `posts_created_at_idx` - Index on (`created_at`)

#### Foreign Keys

- `posts_user_id_fkey` - (`user_id`) references `users(id)`

## Enums

### `post_status`

```sql
CREATE TYPE post_status AS ENUM (
  'draft',
  'published',
  'archived'
);
```

## Views

### `active_users`

Shows users with at least one published post.

```sql
CREATE VIEW active_users AS
SELECT DISTINCT u.*
FROM users u
JOIN posts p ON p.user_id = u.id
WHERE p.status = 'published';
```

## Functions

### `update_timestamp()`

Updates the `updated_at` column on record modification.

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';
```

## Triggers

### `users_timestamp_trigger`

```sql
CREATE TRIGGER users_timestamp_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
```

## Migrations

### Initial Schema

```sql
-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar(255) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  title varchar(255) NOT NULL,
  content text NOT NULL,
  status post_status NOT NULL DEFAULT 'draft',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Backup & Recovery

### Backup Command

```bash
pg_dump -Fc dbname > backup.dump
```

### Restore Command

```bash
pg_restore -d dbname backup.dump
```

## Performance Considerations

1. Indexed columns for frequent queries
2. Partitioned tables for large datasets
3. Materialized views for complex queries
4. Regular VACUUM and ANALYZE

## Security

1. Row-Level Security (RLS) policies
2. Limited user permissions
3. Encrypted sensitive data
4. Audit logging

## Notes

- Database version: PostgreSQL 14
- Character encoding: UTF-8
- Collation: en_US.UTF-8
- Timezone: UTC 