# Rendering Settings

Resolution, frame rate, background, and export settings can be configured in the **Motion Canvas editor UI** (Video Settings tab) or programmatically via the agent plugin HTTP API.

## Resolution

Default is 1920x1080 (1080p). Common options:

| Resolution | Size |
|-----------|------|
| 720p | 1280 x 720 |
| 1080p | 1920 x 1080 |
| 4K | 3840 x 2160 |
| Square | 1080 x 1080 |
| Vertical | 1080 x 1920 |

## Frame Rate

- 30 FPS — smaller file size
- 60 FPS — smoother animation (default)

## Background

Set in the editor or programmatically in scenes:

```ts
view.fill('#0F172A');   // Solid color
view.fill(null);         // Transparent
```

## Exporters

Motion Canvas supports multiple exporters:

- **Image Sequence** (default, `@motion-canvas/core/image-sequence`): Outputs individual PNG frames
- **Video/FFmpeg** (`@motion-canvas/ffmpeg`): Outputs MP4 via FFmpeg

### FFmpeg Setup

```bash
npm install @motion-canvas/ffmpeg
```

Add the server plugin to `vite.config.ts`:

```ts
import ffmpeg from '@motion-canvas/ffmpeg/lib/server';

export default defineConfig({
  plugins: [
    motionCanvas(),
    ffmpeg(),
  ],
});
```

Requires `ffmpeg` installed on the system (`brew install ffmpeg` / `apt install ffmpeg`).

## Programmatic Rendering (Agent Plugin)

With the motion-canvas-agent plugin, all settings can be controlled via HTTP and rendering can be triggered without using the editor UI.

### Configure Settings

```bash
# Set resolution
curl -X POST localhost:9000/__agent/settings/size \
  -H "Content-Type: application/json" -d '{"width": 1920, "height": 1080}'

# Set background
curl -X POST localhost:9000/__agent/settings/background \
  -H "Content-Type: application/json" -d '{"color": "#0F172A"}'

# Set rendering FPS
curl -X POST localhost:9000/__agent/settings/rendering-fps \
  -H "Content-Type: application/json" -d '{"fps": 30}'

# Set rendering scale (1 = 100%, 2 = 200%)
curl -X POST localhost:9000/__agent/settings/rendering-scale \
  -H "Content-Type: application/json" -d '{"scale": 1}'

# Set playback range (frames)
curl -X POST localhost:9000/__agent/settings/range \
  -H "Content-Type: application/json" -d '{"start": 0, "end": 300}'

# Get current settings
curl localhost:9000/__agent/settings
```

### Trigger Rendering

```bash
# Render with default exporter (image sequence)
curl -X POST localhost:9000/__agent/render

# Render with FFmpeg (outputs MP4)
curl -X POST localhost:9000/__agent/render \
  -H "Content-Type: application/json" \
  -d '{"exporter": "@motion-canvas/ffmpeg"}'

# Render with overrides
curl -X POST localhost:9000/__agent/render \
  -H "Content-Type: application/json" \
  -d '{"exporter": "@motion-canvas/ffmpeg", "fps": 60}'

# Abort an in-progress render
curl -X POST localhost:9000/__agent/render/abort
```

Output is saved to the `output/` directory in the project root.

## Project Audio

```ts
import {makeProject} from '@motion-canvas/core';
import bgMusic from './audio/background.mp3';

export default makeProject({
  scenes: [scene],
  audio: bgMusic,
});
```
