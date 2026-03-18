# SVG Component

Animatable SVG with morph support and child access.

## Basic Usage

```ts
import {SVG} from '@motion-canvas/2d';
import svgContent from './assets/drawing.svg?raw';

<SVG svg={svgContent} width={400} height={400} />
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
