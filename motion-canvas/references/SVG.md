# SVG Component

Animatable SVG with morph support and child access.

**Use `<SVG>` instead of `<Img>` when you need to animate the SVG**
(per-element tweens, `getChildrenById`, morphing). `<Img>` rasterises the
SVG before drawing, so individual paths/groups become inaccessible.

## Basic Usage

```ts
import {SVG} from '@motion-canvas/2d';
import svgContent from './assets/drawing.svg?raw';

<SVG svg={svgContent} width={400} height={400} />
```

## Loading an SVG from a URL (e.g. asset URLs)

The `svg` prop takes the **source string**, not a URL. For SVG assets
served from `/media/resolve/<key>` (uploads, Wikipedia), fetch the bytes
at scene start by **yielding the promise** — Motion Canvas's threading
runtime resolves yielded promises automatically. `await` does NOT work
inside a `makeScene2D` generator (it's not an async function); `yield` does.

```ts
import {SVG, makeScene2D} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  // Yield the fetch promise — runtime resolves it before continuing.
  const svgSource: string = yield fetch(asset.url).then(r => r.text());

  view.add(<SVG svg={svgSource} width={400} height={400} />);

  // Now individual elements are animatable, e.g. via getChildrenById below.
});
```

## Morphing Between SVGs

```ts
const svgRef = createRef<SVG>();

<SVG ref={svgRef} svg={svg1} />

// Animate morph to a different SVG
yield* svgRef().svg(svg2, 1);
```

## Accessing SVG Children

```ts
// Access child elements by their SVG ID attribute
const nodes = svgRef().getChildrenById('circle-1');
```
