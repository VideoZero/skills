# Effects System

Side-effect handlers that run when signal dependencies change.

## createEffect

Runs a callback whenever any signal it reads changes:

```ts
import {createEffect, createSignal} from '@motion-canvas/core';

const size = createSignal(100);
const color = createSignal('#e13238');

createEffect(() => {
  // Runs whenever size() or color() changes
  const s = size();
  const c = color();
  // Side effects: logging, external API calls, etc.
});

// Changing signals triggers the effect
yield* size(200, 1);   // Effect runs during tween
yield* color('#68ABDF', 0.5);
```

## createDeferredEffect

Like `createEffect` but runs after the current frame completes, batching multiple changes:

```ts
import {createDeferredEffect, createSignal} from '@motion-canvas/core';

const x = createSignal(0);
const y = createSignal(0);

createDeferredEffect(() => {
  // Runs once after both x and y finish changing in the same frame
  console.log(`Position: ${x()}, ${y()}`);
});
```

## createComputed

Derived signal that auto-updates when dependencies change:

```ts
import {createSignal, createComputed} from '@motion-canvas/core';

const width = createSignal(100);
const height = createSignal(50);

// Automatically recalculates when width or height changes
const area = createComputed(() => width() * height());
const aspect = createComputed(() => (width() / height()).toFixed(2));

<Txt text={() => `Area: ${area()}`} />

yield* width(300, 1); // area() and aspect() auto-update
```

Use `createComputed` instead of `createEffect` when you need a **derived value**, not a side effect.

## createComputedAsync

Async version of `createComputed` for values that require async resolution:

```ts
import {createComputedAsync} from '@motion-canvas/core';

// Returns null initially, then the resolved value
const data = createComputedAsync(async () => {
  const response = await fetch(url);
  return response.json();
});

// With initial value (avoids null)
const dataWithDefault = createComputedAsync(
  async () => fetch(url).then(r => r.json()),
  {fallback: 'data'},
);
```

## When to Use

- **createEffect**: Immediate side effects needed during animation (logging, external state sync)
- **createDeferredEffect**: Batched side effects after frame completion (performance-sensitive operations)
- **Computed signals**: Prefer computed signals over effects for derived values — effects are for *side effects*, not derived state

## Cleanup

Effects are automatically cleaned up when the scene is disposed. No manual cleanup is needed.
