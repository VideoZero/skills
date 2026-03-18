# Spring Animations

Physics-based animations using Hooke's law for natural, bouncy motion.

## Preset Springs

```ts
import {
  spring,
  PlopSpring,
  SmoothSpring,
  BeatSpring,
  BounceSpring,
  SwingSpring,
  JumpSpring,
  StrikeSpring,
} from '@motion-canvas/core';

// Plop — bouncy entrance
yield* spring(PlopSpring, -400, 400, value => {
  circle().position.x(value);
});

// Smooth — gentle, no bounce
yield* spring(SmoothSpring, 1, 2, value => {
  circle().scale(value);
});
```

## All Preset Springs

| Preset | Behavior | Use Case |
|--------|----------|----------|
| `PlopSpring` | Bouncy overshoot | Entrances, pop-in effects |
| `SmoothSpring` | Gentle, no bounce | Smooth transitions |
| `BeatSpring` | Sharp attack, quick settle | Rhythmic emphasis |
| `BounceSpring` | Multiple bounces | Playful motion |
| `SwingSpring` | Pendulum-like swing | Swaying, rocking |
| `JumpSpring` | Quick jump with settle | Button presses, hops |
| `StrikeSpring` | Fast strike with recoil | Impact effects |

## Custom Spring

```ts
const mySpring = {
  mass: 1,       // Higher = slower
  stiffness: 100, // Higher = faster
  damping: 10     // Lower = more bouncy
};

yield* spring(mySpring, 0, 360, value => {
  circle().rotation(value);
});
```

## Parameters

| Parameter | Effect |
|-----------|--------|
| `mass` | Object mass — higher values make animation slower |
| `stiffness` | Spring strength — higher values make animation faster |
| `damping` | Friction — lower values produce more bounce |
