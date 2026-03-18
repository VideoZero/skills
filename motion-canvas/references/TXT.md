# Txt Component

## Basic Usage

```ts
import {Txt} from '@motion-canvas/2d';

<Txt
  text={'Hello World'}
  fontSize={64}
  fontFamily={'Inter'}
  fontWeight={700}           // 100-900
  fontStyle={'italic'}       // 'normal' | 'italic'
  fill={'#ffffff'}
  stroke={'#000000'}
  lineWidth={2}
  textAlign={'center'}       // 'left' | 'center' | 'right'
  textWrap={true}            // false | true | 'pre'
  lineHeight={80}
  letterSpacing={2}
/>
```

## Dynamic Text

```ts
const count = createSignal(0);

<Txt text={() => `Count: ${count()}`} fontSize={48} />

yield* count(100, 2); // Text updates automatically
```

## Multi-line Text

Use backticks for multi-line strings, **not** `\n` within quotes:

```ts
// Correct
<Txt text={`Line 1
Line 2
Line 3`} textWrap={'pre'} />

// Wrong — \n won't render as newlines
<Txt text="Line 1\nLine 2" />
```

## textWrap Values

| Value | Behavior |
|-------|----------|
| `false` | No wrapping — text overflows (default) |
| `true` | Wraps text at word boundaries within parent width |
| `'pre'` | Preserves whitespace and line breaks (use with backtick strings) |

```ts
// No wrapping
<Txt textWrap={false} text={'Long text that overflows...'} />

// Auto-wrap within parent
<Rect width={300} layout>
  <Txt textWrap={true} text={'Long text that wraps at word boundaries'} />
</Rect>

// Preserve line breaks (use backtick strings, not \n)
<Txt textWrap={'pre'} text={`Line 1
Line 2
Line 3`} />
```

## Animated Text Properties

```ts
const txtRef = createRef<Txt>();

<Txt ref={txtRef} text="Hello" fontSize={48} fill={'white'} />

// Animate text content
yield* txtRef().text('World', 0.5);

// Animate visual properties
yield* txtRef().fontSize(72, 0.5);
yield* txtRef().fill('#e13238', 0.5);
yield* txtRef().opacity(0, 0.3);
```

## Centering Text

Use layout properties on the parent container:

```ts
<Layout layout alignItems={'center'} justifyContent={'center'}>
  <Txt text="Centered" fontSize={48} />
</Layout>
```

## maxWidth Caveat

Having `maxWidth` on `Txt` nodes causes issues with layout nodes. Wrap in a container instead:

```ts
// Bad
<Txt maxWidth={300} text="Long text..." />

// Good
<Rect width={300} layout>
  <Txt text="Long text..." textWrap={true} />
</Rect>
```
