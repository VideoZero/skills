# Filters

CSS-based visual filters for any node. Import filter functions from `@motion-canvas/2d`.

## Available Filters

```ts
import {blur, brightness, contrast, grayscale, sepia, hue, saturate, invert} from '@motion-canvas/2d';
```

| Filter | Range | Description |
|--------|-------|-------------|
| `blur(px)` | 0+ pixels | Gaussian blur |
| `brightness(val)` | 0-3 (1 = normal) | Brightness adjustment |
| `contrast(val)` | 0-3 (1 = normal) | Contrast adjustment |
| `grayscale(val)` | 0-1 (0 = color, 1 = gray) | Desaturation |
| `sepia(val)` | 0-1 | Sepia tone |
| `hue(deg)` | 0-360 degrees | Hue rotation |
| `saturate(val)` | 0-3 (1 = normal) | Saturation boost |
| `invert(val)` | 0-1 | Color inversion |

## Basic Usage

```ts
<Circle
  width={200}
  height={200}
  fill={'#e13238'}
  filters={[blur(5)]}
/>
```

## Composed Filters

Multiple filters can be combined in the array:

```ts
<Rect
  fill={'#68ABDF'}
  filters={[blur(3), brightness(1.5), saturate(2)]}
/>
```

## Animated Filters

Filter arrays are animatable:

```ts
const rect = createRef<Rect>();

<Rect ref={rect} fill={'#e13238'} filters={[blur(0), grayscale(0)]} />

// Animate to blurred and grayscale
yield* rect().filters([blur(10), grayscale(1)], 1);

// Animate back to normal
yield* rect().filters([blur(0), grayscale(0)], 1);
```

## Common Patterns

**Focus effect** — blur background, keep foreground sharp:
```ts
yield* background().filters([blur(8), brightness(0.6)], 0.5);
```

**Desaturate on exit:**
```ts
yield* all(
  node().opacity(0.5, 0.5),
  node().filters([grayscale(1)], 0.5),
);
```

**Color shift:**
```ts
yield* node().filters([hue(180)], 1);  // Shift hue 180°
```
