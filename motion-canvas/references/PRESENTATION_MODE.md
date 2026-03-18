# Presentation Mode

Interactive slide-based playback with keyboard navigation.

## Usage

```ts
import {beginSlide} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  view.add(<Txt ref={title} text="Slide 1" fontSize={72} />);
  yield* beginSlide('intro');

  yield* title().text('Slide 2', 0.6);
  yield* beginSlide('content');

  yield* title().opacity(0, 0.3);
  yield* beginSlide('conclusion');
});
```

## Controls

- SPACE or → — Next slide
- ← — Previous slide
- Click slide name in panel
- Full-screen mode available
