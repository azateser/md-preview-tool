# Component: [Component Name]

## Overview

Brief description of what this component does and when to use it.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `prop1` | `string` | Yes | - | Description of prop1 |
| `prop2` | `number` | No | `0` | Description of prop2 |
| `prop3` | `() => void` | No | - | Callback function |

## Examples

### Basic Usage

```jsx
import { Component } from '@/components';

function Example() {
  return (
    <Component
      prop1="value"
      prop2={42}
      prop3={() => console.log('Callback')}
    />
  );
}
```

### With Custom Styling

```jsx
import { Component } from '@/components';

function StyledExample() {
  return (
    <Component
      className="custom-class"
      style={{ color: 'red' }}
    />
  );
}
```

## Styling

The component accepts the following styling props:

- `className`: Custom CSS class
- `style`: Inline styles object

### CSS Variables

```css
.component {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --padding: 1rem;
}
```

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Screen reader friendly

## Best Practices

1. Always provide required props
2. Use semantic HTML elements
3. Follow component composition patterns
4. Handle error states appropriately

## Related Components

- `ComponentA`: Used together for complex layouts
- `ComponentB`: Alternative for different use cases
- `ComponentC`: Parent component

## Notes

- Browser compatibility: IE11+
- Performance considerations
- Known limitations
