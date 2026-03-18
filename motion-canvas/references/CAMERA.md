# Camera & Viewport

## Basic Camera

```ts
import {Camera} from '@motion-canvas/2d';

const camera = createRef<Camera>();

view.add(
  <Camera ref={camera}>
    <Circle />
    <Rect />
  </Camera>
);

// Pan
yield* camera().position.x(200, 1);
yield* camera().position.y(-100, 1);

// Zoom (use zoom(), not scale)
yield* camera().zoom(2, 1);

// Rotate
yield* camera().rotation(45, 1);

// Reset all
yield* camera().reset(1);
```

## Center on Object

```ts
const circle = createRef<Circle>();

// Center on a node (animated)
yield* camera().centerOn(circle(), 1);

// Center on a position (animated)
yield* camera().centerOn([200, 100], 1);
```

> **Note:** `centerOn` requires a duration and always returns a generator. There is no continuous tracking overload — for tracking, reactively bind the camera position instead:
> ```ts
> camera().position(() => circle().position().scale(-1));
> ```

## Follow Path

```ts
const path = createRef<Spline>();
yield* camera().followCurve(path(), 2);
```

## Multiple Cameras

Split-screen and picture-in-picture effects:

```ts
const cam1 = createRef<Camera>();
const cam2 = createRef<Camera>();

// Shared content
view.add(
  <>
    <Circle />
    <Rect />
  </>
);

// Camera viewports (note: prop is `cameraRef`, not `camera`)
view.add(
  <>
    <Camera.Stage
      cameraRef={cam1}
      x={-400}
      width={800} height={600}
    />
    <Camera.Stage
      cameraRef={cam2}
      x={400}
      width={800} height={600}
    />
  </>
);

// Control independently
yield* all(
  cam1().zoom(2, 1),
  cam2().rotation(45, 1)
);
```
