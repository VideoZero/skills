# Media Components

> **For animatable SVG content, use `<SVG>` (see `SVG.md`), not `<Img>`.**
> `<Img>` rasterises the SVG before drawing, so individual paths /
> groups are inaccessible. `<SVG>` parses the markup into Motion Canvas
> nodes that can be tweened per-element, morphed, or addressed by id.
> The `SVG` doc covers the URL-loading pattern (`yield fetch(...)`).

## Img (Images)

```ts
import {Img} from '@motion-canvas/2d';
import logoSvg from './assets/logo.svg';
import photoPng from './assets/photo.png';

<Img
  src={logoSvg}
  width={400} height={300}
  scale={1.5}
  smoothing={true}  // Anti-aliasing
/>

// SVGs scale perfectly
<Img src={logoSvg} scale={5} />
```

### Fitting modes (contain / cover / fill)

Motion Canvas's `Img` has no `objectFit` prop; emulate the three CSS modes
with a few lines. When the asset's natural dimensions are known up front
(e.g. populated as `asset.width` / `asset.height` on user-uploaded files),
the scale can be pre-computed and there's no need to wait for image load.

Assume a 1920×1080 photo at `https://cdn.example/photo.jpg` for the snippets
below.

**Contain** — fit inside bounds, preserve aspect, may have empty space.
Set ONE dimension; the other is auto-derived from the natural aspect ratio.

```ts
<Img src="https://cdn.example/photo.jpg" width={400} />
// height auto-derived → 225px (1080 * 400/1920)
```

**Cover** — fill bounds, preserve aspect, crop overflow. Wrap in a
clipping parent and size the image to overflow on the smaller axis:

```ts
const BOX_W = 400, BOX_H = 300;
const natW = 1920, natH = 1080; // from asset.width / asset.height
const scale = Math.max(BOX_W / natW, BOX_H / natH);

<Rect width={BOX_W} height={BOX_H} clip>
  <Img
    src="https://cdn.example/photo.jpg"
    width={natW * scale}
    height={natH * scale}
  />
</Rect>
```

**Fill** — stretch to exact bounds, distort aspect. Just set both:

```ts
<Img src="https://cdn.example/photo.jpg" width={400} height={300} />
```

**When natural dimensions aren't known up front**, `Img` exposes
`naturalSize()`; wire it through `createComputed` so the size reacts
once the image finishes loading:

```ts
import {Img, Rect} from '@motion-canvas/2d';
import {createRef, createComputed} from '@motion-canvas/core';

const BOX_W = 400, BOX_H = 300;
const img = createRef<Img>();
const coverScale = createComputed(() => {
  const ns = img().naturalSize();
  return Math.max(BOX_W / ns.x, BOX_H / ns.y);
});

<Rect width={BOX_W} height={BOX_H} clip>
  <Img
    ref={img}
    src="https://cdn.example/photo.jpg"
    size={() => [img().naturalSize().x * coverScale(),
                 img().naturalSize().y * coverScale()]}
  />
</Rect>
```

## Icon (Iconify — 150k+ icons)

```ts
import {Icon} from '@motion-canvas/2d';

<Icon icon={'mdi:home'} width={100} height={100} color={'#ffffff'} />

// Popular icon sets
<Icon icon={'fa:user'} size={80} color={'#68ABDF'} />
<Icon icon={'carbon:code'} size={80} color={'#e13238'} />
<Icon icon={'lucide:github'} size={80} color={'white'} />
```

**Animated icon changes:**
```ts
const iconRef = createRef<Icon>();
<Icon ref={iconRef} icon={'mdi:heart-outline'} size={100} />

yield* iconRef().icon('mdi:heart', 0.5);   // Change icon
yield* iconRef().color('#e13238', 0.5);     // Change color
```

## Video

```ts
import {Video} from '@motion-canvas/2d';
import videoFile from './videos/intro.mp4';

<Video src={videoFile} width={800} height={450} />
```

### Video Playback Controls

```ts
const video = createRef<Video>();

<Video ref={video} src={videoFile} width={800} height={450} />

// Play from current position
video().play();

// Pause playback
video().pause();

// Seek to specific time (seconds)
video().seek(5.0);

// Get current time
const currentTime = video().getCurrentTime();

// Set playback rate
video().playbackRate(2);  // 2x speed

// Loop video
<Video src={videoFile} loop={true} />
```

### Syncing Video with Animation

```ts
// Play video in sync with the animation timeline
video().play();
yield* waitFor(5);  // Let video play for 5 seconds
video().pause();

// Or use video time as a signal
yield* video().getCurrentTime();
```

## Audio

Audio files can be added to the project for narration or background music:

```ts
import {makeProject} from '@motion-canvas/core';
import audioFile from './audio/narration.mp3';

export default makeProject({
  scenes: [scene],
  audio: audioFile,  // Global audio track
});
```