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

Layout controls the size and position of all its children. If a child needs to manage its own size (e.g. a reactively-sized circle), wrap it in a fixed-size slot with `layout={false}` inside:

```ts
<Layout layout direction={'column'} gap={40} alignItems={'center'}>
  <Txt text={'Title'} fontSize={36} fill={'#fff'} />

  {/* Fixed-size slot participates in the layout */}
  <Rect width={400} height={400}>
    {/* layout={false} lets children control their own size */}
    <Rect layout={false}>
      <Circle width={() => radius() * 2} height={() => radius() * 2} stroke={'#818CF8'} lineWidth={3} />
    </Rect>
  </Rect>
</Layout>
```

Without `layout={false}`, the layout engine overrides the circle's reactive width/height and stretches it to fill the container.

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
