# Hook: use[HookName]

## Overview

Brief description of what this hook does and its purpose.

## Usage

```typescript
const result = useHook(param1, param2);
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `param1` | `string` | Yes | - | Description of param1 |
| `param2` | `Options` | No | `{}` | Configuration options |

## Return Value

```typescript
{
  data: T;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

## Type Definitions

```typescript
interface Options {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

type HookResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};
```

## Examples

### Basic Usage

```typescript
import { useHook } from '@/hooks';

function Component() {
  const { data, loading, error } = useHook('param1', {
    enabled: true,
    onSuccess: (data) => console.log(data),
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <div>{data}</div>;
}
```

### With Custom Options

```typescript
const { data, refetch } = useHook('param1', {
  enabled: false,
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});
```

## Best Practices

1. Always handle loading and error states
2. Use appropriate dependency array
3. Consider memoization for expensive computations
4. Clean up side effects in useEffect

## Common Issues

- Infinite re-renders
- Memory leaks
- Race conditions
- Stale closures

## Related Hooks

- `useRelatedHook1`: Description
- `useRelatedHook2`: Description
- `useRelatedHook3`: Description

## Notes

- Server-side rendering considerations
- Performance implications
- Browser compatibility 