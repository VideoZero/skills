---
name: animation-basics
description: Animation theory covering the 12 principles of animation and timing guidance. Use when designing motion, choosing easing approaches, or improving animation quality.
---

# 12 Principles of Animation

## 1. Squash and Stretch

Stretch in the area of more movement, squash on collision. Always conserve area — if you stretch one axis, compress the other.

## 2. Anticipation

Build up energy before action, like a spring loading. Can be combined with squash and stretch.

## 3. Staging

- Avoid competing for stage presence — one action at a time draws focus.
- Use the Camera to zoom into interesting areas.
- Insert pauses to let the viewer process information.
- Let text remain on screen long enough to read (up to 3x the time it takes to read aloud).

## 4. Follow Through and Overlapping Action

Drag adds realism. The main body leads; appendages follow with delay. This communicates mass. Use different timing functions for leading vs trailing parts. Skew can sell the effect.

## 5. Slow In and Slow Out

Essential for realism. Objects ease into and out of motion. Exception: collisions — ease only on the outward motion, not at impact. When motion is very fast, no inbetween frames may be needed — perfect for swapping icons or SVGs at the midpoint.

## 6. Arc

Move in arcs instead of straight lines when appropriate, especially when gravity is involved.

## 7. Secondary Action

Supplementary actions that support the main action. Example: a background element pulsing while the foreground element transitions.

## 8. Exaggeration

Not more distorted — more convincing. Quick motions need bigger exaggeration to be noticed at all.

## 9. Solid Drawing

Avoid parallel lines for a more natural, dynamic look. Exception: graphs and data visualizations where parallel structure is intentional.

## 10. Appeal

Keep it simple. Do not add too many details. Clarity and readability beat complexity.

---

# Timing Guidance

- Prefer ease-in-out-cubic curves for most animations — natural acceleration and deceleration.
- A quick ease-in-out animation lets you swap icons or SVGs at the 50% mark — the fastest point of movement where the change is least noticeable.
- Use arc-based interpolation for movements that should follow a curved path, especially with gravity.

