# Media Components

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