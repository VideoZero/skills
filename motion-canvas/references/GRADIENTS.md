# Gradients

Gradient fills for shapes. Import `Gradient` from `@motion-canvas/2d`.

## Gradient Types

Three types: `linear`, `radial`, `conic`.

```ts
import {Gradient} from '@motion-canvas/2d';
```

## Linear Gradient

```ts
const grad = new Gradient({
  type: 'linear',
  from: [-100, -100],
  to: [100, 100],
  stops: [
    {offset: 0, color: '#e13238'},
    {offset: 0.5, color: '#e6a700'},
    {offset: 1, color: '#99C47A'},
  ],
});

<Rect width={200} height={200} fill={grad} />
```

You can also use `angle` instead of `from`/`to`:
```ts
new Gradient({type: 'linear', angle: 45, stops: [...]});
```

## Radial Gradient

```ts
const grad = new Gradient({
  type: 'radial',
  fromRadius: 0,
  toRadius: 100,
  stops: [
    {offset: 0, color: '#68ABDF'},
    {offset: 1, color: '#0F172A'},
  ],
});

<Circle width={200} height={200} fill={grad} />
```

## Conic Gradient

```ts
const grad = new Gradient({
  type: 'conic',
  stops: [
    {offset: 0, color: '#e13238'},
    {offset: 0.25, color: '#e6a700'},
    {offset: 0.5, color: '#99C47A'},
    {offset: 0.75, color: '#68ABDF'},
    {offset: 1, color: '#e13238'},
  ],
});

<Circle width={200} height={200} fill={grad} />
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'linear' \| 'radial' \| 'conic'` | Gradient type |
| `from` | `PossibleVector2` | Start position (linear) |
| `to` | `PossibleVector2` | End position (linear) |
| `angle` | `number` | Angle in degrees (linear) |
| `fromRadius` | `number` | Inner radius (radial) |
| `toRadius` | `number` | Outer radius (radial) |
| `stops` | `GradientStop[]` | Color stops |

## GradientStop

```ts
interface GradientStop {
  offset: number;  // 0 to 1
  color: PossibleColor;
}
```

Gradients can be used anywhere a color is accepted: `fill`, `stroke`, etc.
