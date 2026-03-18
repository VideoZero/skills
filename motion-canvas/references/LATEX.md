# LaTeX Component

Renders mathematical equations using LaTeX.

## Basic Usage

```ts
import {Latex} from '@motion-canvas/2d';

<Latex tex={'y = mx + b'} fill={'white'} width={300} />
```

## Escaping Backslashes

```ts
// No escape needed in JSX attribute:
<Latex tex="{\frac{1}{2}}" />

// Escape necessary in JS expression:
<Latex tex={'{\frac{1}{2}}'} />
```

## Missing Spaces Fix

```ts
// This will break:
<Latex tex={['\\Delta', 'y']} />

// Wrap in brackets to prevent it:
<Latex tex={['\\Delta', '{y}']} />
```

## Animated Equations

```ts
const latexRef = createRef<Latex>();

<Latex
  ref={latexRef}
  tex={['y', '=', '{{a}}{{x^2}} + {{bx}} + {{c}}']}
/>

// Animate equation changes
yield* latexRef().tex(['y', '=', '{{x^2}}'], 1);
```
