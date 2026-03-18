# Transforms & Coordinate System

## Coordinate System

- Origin `(0, 0)` at scene center
- X-axis: positive right, negative left
- Y-axis: positive **down**, negative up

```ts
<Circle position={[100, -50]} />  // Right 100, up 50
<Rect x={-200} y={100} />          // Left 200, down 100
```

## Transform Properties

```ts
// Position
circle().position(new Vector2(100, 200));
circle().position.x(100);
circle().x(100);  // Shorthand

// Scale
circle().scale(1.5);                       // Uniform
circle().scale(new Vector2(2, 0.5));       // Non-uniform

// Rotation (degrees)
circle().rotation(45);

// Skew
circle().skew(new Vector2(10, 0));
```

## Animated Transforms

```ts
yield* circle().position(new Vector2(300, 0), 1);
yield* circle().position.x(300, 1);
yield* circle().scale(2, 1);
yield* circle().rotation(360, 2);

// Parallel
yield* all(
  circle().position.x(300, 1),
  circle().rotation(180, 1),
  circle().scale(1.5, 1)
);
```

## Hierarchical Transforms

Parent transforms propagate to children:

```ts
const parent = createRef<Rect>();
const child = createRef<Circle>();

view.add(
  <Rect ref={parent}>
    <Circle ref={child} x={100} />
  </Rect>
);

// Rotating parent rotates child too
yield* parent().rotation(45, 1);
```

## Absolute Transforms

Transform in world space regardless of parent:

```ts
// Match world position of another node
circle().absolutePosition(target().absolutePosition());

// Reactive tracking
circle().absolutePosition(() => target().absolutePosition());

// Maintain absolute scale/rotation despite parent transforms
child().absoluteScale(1);
child().absoluteRotation(0);
```

**Keep UI element upright:**
```ts
view.add(
  <Rect ref={container} rotation={45}>
    <Txt ref={label} text="Always Upright" />
  </Rect>
);
yield* label().absoluteRotation(0);
yield* container().rotation(180, 2); // Label stays upright
```

## Matrix Operations

```ts
// Local to world space
const worldPos = node().localToWorld(new Vector2(100, 0));

// World to local space
const localPos = node().worldToLocal(worldPos);

// Local to parent space
const parentPos = node().localToParent(new Vector2(50, 50));
```
