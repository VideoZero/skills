# Layout System

## Flexbox Layouts

Any node becomes a layout container with the `layout` prop:

```ts
import {Layout, Rect, Circle} from '@motion-canvas/2d';

<Rect layout>
  <Circle width={50} height={50} fill={'red'} />
  <Circle width={50} height={50} fill={'blue'} />
</Rect>

// Or use Layout component (must add layout property!)
<Layout layout>
  <Rect />
  <Circle />
</Layout>
```

## Stack Helpers: VStack and HStack

`VStack` and `HStack` (from `@motion-canvas/2d`) are pre-configured `Layout` nodes. **`layout` is implicit** — passing it explicitly is a TypeScript error (`Property 'layout' does not exist on type 'Omit<LayoutProps, "layout" | "direction">'`). Same for `direction`: VStack is locked to `column`, HStack to `row`. Pass any other `LayoutProps` (size, alignItems, justifyContent, gap, padding, opacity, ref, etc.) normally.

```ts
import {VStack, HStack} from '@motion-canvas/2d';

// ❌ TypeScript error — VStack has layout/direction locked
<VStack layout direction={'column'} gap={20}>...</VStack>

// ✅ Just use the props it accepts
<VStack gap={20} alignItems={'center'}>...</VStack>
```

### Adding a stack directly under `view`

`view` is not a layout container by default, so a bare `<VStack gap={20}>` added to `view` is sized to its children and centered at the origin (0, 0). That works for compact, naturally-sized content, but if you want a stack that **fills the viewport and centers its children inside the frame**, set explicit dimensions and alignment on the stack itself:

```ts
// Compact stack, sized to its children, centered at origin (0, 0)
view.add(
  <VStack gap={40} alignItems={'center'}>
    <Txt text={'Title'} fontSize={96} fill={'#fff'} />
    <Txt text={'Subtitle'} fontSize={48} fill={'#aaa'} />
  </VStack>
);

// Fullscreen stack — the stack itself fills the view and centers its children
view.add(
  <VStack
    ref={section}
    width={'100%'}
    height={'100%'}
    alignItems={'center'}
    justifyContent={'center'}
    gap={40}
    opacity={0}
  >
    <Txt text={'Title'} fontSize={96} fill={'#fff'} />
    <Txt text={'Subtitle'} fontSize={48} fill={'#aaa'} />
  </VStack>,
);
```

If a stack appears to render blank or off-screen, the cause is almost always one of:
- Missing `width`/`height` on the stack itself when you wanted it to span the viewport.
- Wrapping the stack inside a non-layout `<Rect>` (or `<Node>`) that has its own opaque `fill` and no `layout` enabled — the parent draws on top and the children pile at its origin without flex behaviour. Either add `layout` (with the alignment props) to the wrapper, or skip the wrapper and add the stack directly to `view`.

`opacity={0}` on a stack does propagate to its children — use it to fade whole sections in/out cleanly.

## Size Properties

```ts
<Rect width={200} height={100} />        // Fixed pixels
<Rect width={'50%'} height={'100%'} />   // Percentage of parent
<Rect width={null} height={null} />       // Auto-size to content
<Rect size={[400, 200]} />                // Size signal

// Grow to fill available space
<Layout layout>
  <Rect grow={1} />  {/* 1 part */}
  <Rect grow={3} />  {/* 3 parts */}
</Layout>
```

## Spacing Properties

```ts
<Layout
  layout
  gap={20}           // Space between children
  padding={40}       // Internal padding (all sides)
  paddingTop={20}
  paddingRight={20}
  paddingBottom={20}
  paddingLeft={20}
  margin={20}        // External margin
>
```

## Direction and Alignment

```ts
<Layout
  layout
  direction={'column'}         // 'row' | 'column' | 'row-reverse' | 'column-reverse'
  alignItems={'center'}        // 'start' | 'center' | 'end' | 'stretch'
  justifyContent={'center'}    // 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap={'wrap'}                // 'nowrap' | 'wrap' | 'wrap-reverse'
>
```

## Centering Children Inside a Node

Child nodes are **not** automatically centered inside their parent. Without `layout`, children default to the parent's origin point. To center text or other children inside a shape, enable `layout` with centering:

```ts
// Bad — text is not centered inside the rect
<Rect width={100} height={100} fill={'red'}>
  <Txt text={'1'} fill={'white'} />
</Rect>

// Good — layout with centering
<Rect width={100} height={100} fill={'red'}
  layout alignItems={'center'} justifyContent={'center'}>
  <Txt text={'1'} fill={'white'} />
</Rect>
```

## Opting Out of Layout for Specific Children

Layout controls the size **and position** of all its children: position tweens (`position.x`, `position.y`) and `spring()` callbacks that set position will be silently overridden every frame. To animate position inside a layout, or to give a child reactive sizing the layout shouldn't override, wrap it in a fixed-size slot containing `<Rect layout={false}>`:

```ts
<Layout layout direction={'column'} gap={40} alignItems={'center'}>
  <Txt text={'Title'} fontSize={36} fill={'#fff'} />

  {/* Fixed-size slot participates in the layout */}
  <Rect width={400} height={400}>
    {/* layout={false} lets children control their own size + position */}
    <Rect layout={false}>
      <Circle ref={circle} width={() => radius() * 2} height={() => radius() * 2} stroke={'#818CF8'} lineWidth={3} />
    </Rect>
  </Rect>
</Layout>

// Now position tweens and springs work — coordinates are local to the layout={false} wrapper
yield* circle().position.x(150, 1);
yield* spring(PlopSpring, -150, 150, v => circle().position.x(v));
```

Without `layout={false}`, the layout engine overrides the circle's reactive width/height/position. The alternative if you can't add a wrapper: animate properties the layout doesn't control (`scale`, `rotation`, `opacity`), or use FLIP helpers (see [FLIP](../../skills-internal/engine/references/FLIP.md)) for reordering and reflows.

## Examples

**Centered layout:**
```ts
<Layout layout width={800} height={600} alignItems={'center'} justifyContent={'center'} gap={20}>
  <Circle width={100} height={100} fill={'red'} />
  <Circle width={100} height={100} fill={'blue'} />
  <Circle width={100} height={100} fill={'green'} />
</Layout>
```

**Flexible grid:**
```ts
<Layout layout direction={'column'} gap={20}>
  <Layout layout gap={20}>
    <Rect grow={1} height={100} fill={'red'} />
    <Rect grow={2} height={100} fill={'blue'} />
  </Layout>
  <Layout layout gap={20}>
    <Rect grow={1} height={100} fill={'green'} />
    <Rect grow={1} height={100} fill={'yellow'} />
    <Rect grow={1} height={100} fill={'purple'} />
  </Layout>
</Layout>
```

## Cardinal Directions

```ts
// Edge positions
circle().top();         // Y position of top edge
circle().bottom();
circle().left();
circle().right();

// Corner positions (Vector2)
circle().topLeft();
circle().topRight();
circle().bottomLeft();
circle().bottomRight();

// Center
circle().middle();
```

**Align above:**
```ts
<Txt text="Label" position={() => circle().top().addY(-50)} />
```

**Space between:**
```ts
const spacing = () => rect2().left() - rect1().right();
```

## Offset (Origin Point)

Controls the node's anchor point for transformations:

| Value | Position |
|-------|----------|
| `[0, 0]` | Center (default) |
| `[-1, -1]` | Top-left |
| `[1, 1]` | Bottom-right |
| `[0, -1]` | Top-center |
| `[0, 1]` | Bottom-center |

```ts
// Rotate from top-left corner
<Rect width={200} height={100} offset={[-1, -1]} rotation={45} />

// Position text by bottom edge
<Txt text="Bottom Aligned" offset={[0, 1]} y={200} />
```
