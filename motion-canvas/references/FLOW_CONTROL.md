# Flow Control Functions

## all() — Run concurrently, wait for all

```ts
import {all} from '@motion-canvas/core';

yield* all(
  circle().position.x(300, 1),
  circle().fill('#e6a700', 1),
  circle().scale(1.5, 1)
);
```

## any() — Run concurrently, wait for first

```ts
import {any} from '@motion-canvas/core';

yield* any(
  circle().position.x(300, 2),
  waitFor(1)  // Completes first
);
```

## chain() — Run sequentially

```ts
import {chain} from '@motion-canvas/core';

yield* chain(
  circle().position.x(300, 1),
  circle().position.y(200, 1),
  circle().scale(2, 1)
);
```

## delay() — Delay before running

```ts
import {delay} from '@motion-canvas/core';

yield* delay(1, circle().scale(2, 1));
```

## sequence() — Stagger start times

```ts
import {sequence} from '@motion-canvas/core';

// Start each 0.1s after previous
yield* sequence(
  0.1,
  circle1().scale(1.5, 0.5),
  circle2().scale(1.5, 0.5),
  circle3().scale(1.5, 0.5)
);

// With array spread
yield* sequence(0.1, ...circles.map(c => c.scale(1.5, 0.5)));
```

## loop() — Repeat animation

```ts
import {loop} from '@motion-canvas/core';

// Repeat 3 times
yield* loop(3, () => circle().rotation(360, 1));

// Infinite (use with spawn)
yield* loop(Infinity, () => circle().rotation(360, 2));
```

## Nested Flow Control

```ts
// Parallel groups in sequence
yield* chain(
  all(
    circle1().scale(2, 1),
    circle2().scale(2, 1)
  ),
  all(
    circle1().position.x(300, 1),
    circle2().position.x(-300, 1)
  )
);
```

## Looping Over Collections

**Parallel with all():**
```ts
yield* all(
  ...rects.map(rect => rect.scale(1.5, 1).to(1, 1))
);
```

**Staggered with sequence():**
```ts
yield* sequence(0.1, ...rects.map(rect => rect.scale(1.5, 0.5)));
```

**Manual loop:**
```ts
for (const rect of rects) {
  yield* rect.scale(1.5, 0.5);
  yield* waitFor(0.1);
}
```
