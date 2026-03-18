# Sounds

> **@alpha** — Available in v3.18.0-alpha.0+

Programmable sound playback synced to the animation timeline.

## Basic Usage

```ts
import {sound} from '@motion-canvas/core';
import clickAudio from './audio/click.mp3';

// Play a sound at the current frame
sound(clickAudio).play();
```

## SoundBuilder API

`sound()` returns a `SoundBuilder` with chainable configuration:

```ts
// Volume control (dB)
sound(audio).gain(-6).play();        // Quieter (-6dB)
sound(audio).gain(3).play();         // Louder (+3dB)

// Pitch shift (cents — 100 cents = 1 semitone)
sound(audio).detune(100).play();     // One semitone up
sound(audio).detune(-200).play();    // Two semitones down

// Playback rate (also affects pitch)
sound(audio).playbackRate(2).play(); // 2x speed

// Trim to specific portion (seconds)
sound(audio).trim(0.5, 1.5).play(); // Play from 0.5s to 1.5s

// Chain multiple settings
sound(audio)
  .gain(-3)
  .detune(200)
  .trim(0, 2)
  .play();
```

## Offset

Play a sound slightly before or after the current frame:

```ts
sound(audio).play(0.1);   // 0.1s after current frame
sound(audio).play(-0.05); // 0.05s before current frame
```

## SoundSettings

| Property | Type | Description |
|----------|------|-------------|
| `audio` | `string` | Audio file path |
| `start` | `number` | Trim start (seconds) |
| `end` | `number` | Trim end (seconds) |
| `gain` | `number` | Volume in dB |
| `detune` | `number` | Pitch shift in cents |
| `playbackRate` | `number` | Speed multiplier (>0) |

## Project Audio Track

For background music or narration, add audio at the project level:

```ts
import {makeProject} from '@motion-canvas/core';
import bgMusic from './audio/background.mp3';

export default makeProject({
  scenes: [scene],
  audio: bgMusic,
});
```
