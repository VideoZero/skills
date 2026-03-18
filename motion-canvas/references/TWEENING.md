# Tweening

## Property Tweening (Shorthand)

```ts
// Basic tween — 2 seconds
yield* circle().fill('#e13238', 2);

// With easing
import {easeOutQuad} from '@motion-canvas/core';
yield* circle().fill('#e13238', 2, easeOutQuad);
```

## Chained Tweens

```ts
yield* circle()
  .fill('#e13238', 1)
  .to('#e6a700', 1)
  .to('#99C47A', 1);

// Return to original
yield* circle()
  .fill('#e13238', 1)
  .to('#e6a700', 1)
  .back(2);  // Animate back over 2s
```

## Parallel Property Tweens

```ts
yield* all(
  circle().position.x(300, 1),
  circle().position.y(200, 1),
  circle().scale(2, 1)
);
```

## Manual Tween

```ts
import {tween, map} from '@motion-canvas/core';

yield* tween(2, value => {
  // value goes from 0 to 1 over 2 seconds
  circle().position.x(map(-300, 300, value));
  circle().opacity(value);
});
```

## Available Easing Functions

```ts
import {
  linear,
  // Sine
  easeInSine, easeOutSine, easeInOutSine,
  // Quadratic
  easeInQuad, easeOutQuad, easeInOutQuad,
  // Cubic
  easeInCubic, easeOutCubic, easeInOutCubic,
  // Quartic
  easeInQuart, easeOutQuart, easeInOutQuart,
  // Exponential
  easeInExpo, easeOutExpo, easeInOutExpo,
  // Circular
  easeInCirc, easeOutCirc, easeInOutCirc,
  // Back (overshoot)
  easeInBack, easeOutBack, easeInOutBack,
  // Elastic
  easeInElastic, easeOutElastic, easeInOutElastic,
  // Bounce
  easeInBounce, easeOutBounce, easeInOutBounce,
} from '@motion-canvas/core';

yield* circle().position.x(300, 1, easeInOutCubic);
```

**Custom easing factories:**
```ts
import {createEaseInBack, createEaseOutElastic, createEaseInOutBounce} from '@motion-canvas/core';

// Custom overshoot amount for back easing
const customBack = createEaseInBack(2.5);
yield* circle().scale(2, 1, customBack);
```

## Math Utilities

```ts
import {map, clamp, remap, clampRemap} from '@motion-canvas/core';

// map(from, to, value) — linear interpolation
map(-300, 300, 0.5); // → 0

// clamp(min, max, value) — constrain to range
clamp(0, 1, 1.5); // → 1

// remap(fromIn, toIn, fromOut, toOut, value) — map between ranges
remap(0, 1, 100, 500, 0.5); // → 300

// clampRemap — remap with clamped input
clampRemap(0, 1, 100, 500, 1.5); // → 500 (clamped)
```

Useful inside `tween()` for complex animations:
```ts
yield* tween(2, value => {
  circle().position.x(map(-300, 300, value));
  circle().opacity(clamp(0, 1, value * 2));
});
```

## Color Interpolation

```ts
import {Color} from '@motion-canvas/core';

yield* tween(2, value => {
  const color = Color.lerp('#ff0000', '#0000ff', value);
  circle().fill(color);
});
```

## Vector Interpolation

```ts
import {Vector2} from '@motion-canvas/core';

const start = new Vector2(-200, 0);
const end = new Vector2(200, 100);

// Linear
yield* tween(2, value => {
  circle().position(Vector2.lerp(start, end, value));
});

// Arc
yield* tween(2, value => {
  circle().position(Vector2.arcLerp(start, end, value, 100));
});
```
