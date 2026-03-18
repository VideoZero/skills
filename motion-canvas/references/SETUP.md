# Project Setup

## Prerequisites

Node.js 16+ required:

```bash
node -v
```

## Create Project

```bash
npm init @motion-canvas@latest
```

The wizard prompts for:
- Project name
- TypeScript (recommended) or JavaScript
- Exporters (image sequence or video/FFmpeg)

## Install & Run

```bash
cd <project-path>
npm install
npm start
```

Editor opens at `http://localhost:9000/`

### Manual Setup (without wizard)

If the wizard is unavailable, install dependencies manually:

```bash
mkdir my-project && cd my-project
npm init -y
npm install @motion-canvas/core @motion-canvas/2d @motion-canvas/vite-plugin @motion-canvas/ui vite@5 typescript
```

**Required packages:**
- `@motion-canvas/core` — Core runtime, signals, animation
- `@motion-canvas/2d` — 2D components (shapes, text, layout, etc.)
- `@motion-canvas/vite-plugin` — Vite integration
- `@motion-canvas/ui` — Editor UI (required by vite-plugin at runtime)
- `vite` — Build tool (**use v5.x**; v8 is incompatible with `@motion-canvas/vite-plugin`)
- `typescript` — Type checking

**Optional packages:**
- `@motion-canvas/ffmpeg` — FFmpeg-based video export (requires `ffmpeg` installed on system)

### FFmpeg Video Export Setup

To export videos as MP4, install the ffmpeg package and add its Vite plugin:

```bash
npm install @motion-canvas/ffmpeg
```

**vite.config.ts:**
```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg/lib/server';

export default defineConfig({
  plugins: [
    motionCanvas(),
    ffmpeg(),
  ],
});
```

Then select "Video (FFmpeg)" as the exporter in the editor's rendering settings, or trigger programmatically via the agent plugin.

Then create the following files:

**package.json:**
```json
{
  "name": "my-project",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "@motion-canvas/core": "^3.17.2",
    "@motion-canvas/2d": "^3.17.2"
  },
  "devDependencies": {
    "@motion-canvas/ui": "^3.17.2",
    "@motion-canvas/vite-plugin": "^3.17.2",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

**tsconfig.json:**
```json
{
  "extends": "@motion-canvas/2d/tsconfig.project.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src", "node_modules/@motion-canvas/core/project.d.ts"]
}
```

**vite.config.ts:**
```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [motionCanvas()],
});
```

## Project Structure

**src/project.ts** — main configuration:

```ts
import {makeProject} from '@motion-canvas/core';
import example from './scenes/example?scene';

export default makeProject({
  scenes: [example],
});
```

The `?scene` query parameter is required for dynamic preview refreshing.

**src/scenes/example.tsx** — your first scene:

```ts
import {Circle, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const myCircle = createRef<Circle>();
  view.add(
    <Circle
      ref={myCircle}
      x={-300}
      width={140}
      height={140}
      fill="#e13238"
    />,
  );

  yield* all(
    myCircle().position.x(300, 1).to(-300, 1),
    myCircle().fill('#e6a700', 1).to('#e13238', 1),
  );
});
```

## Local Motion Canvas Development

To develop against a local clone of the Motion Canvas monorepo, use `file:` dependencies and Vite resolve aliases to point at source directories:

**package.json:**
```json
{
  "name": "my-project",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "@motion-canvas/core": "file:../packages/core",
    "@motion-canvas/2d": "file:../packages/2d"
  },
  "devDependencies": {
    "@motion-canvas/ui": "file:../packages/ui",
    "@motion-canvas/vite-plugin": "file:../packages/vite-plugin"
  }
}
```

**vite.config.ts:**
```ts
import path from 'path';
import {defineConfig} from 'vite';
import motionCanvas from '../packages/vite-plugin/src/main';

const packages = path.resolve(__dirname, '../packages');

export default defineConfig({
  resolve: {
    alias: [
      {find: '@motion-canvas/ui', replacement: path.resolve(packages, 'ui/src/main.tsx')},
      {find: '@motion-canvas/2d/editor', replacement: path.resolve(packages, '2d/src/editor')},
      {find: /@motion-canvas\/2d(\/lib)?/, replacement: path.resolve(packages, '2d/src/lib')},
      {find: '@motion-canvas/core', replacement: path.resolve(packages, 'core/src')},
    ],
  },
  plugins: [
    motionCanvas({buildForEditor: true}),
  ],
});
```

This imports the vite plugin directly from source and aliases all `@motion-canvas/*` imports to local source directories.

## Type-Check Command

```bash
npx tsc --noEmit
```

Run this to validate all scenes without building. Useful in CI/CD.

## Troubleshooting

| Issue | Solution |
|-------|---------|
| `npm init` fails | Update npm to 8.15.1+ or use `npm exec @motion-canvas/create@latest` |
| `npm install` ENOENT error | Verify you ran `cd` into the project directory |
| `Cannot find module '@motion-canvas/ui'` | Install it: `npm install @motion-canvas/ui` |
| `peer vite "4.x \|\| 5.x"` conflict | Pin vite to v5: `npm install "vite@^5"` |
| Black preview | Press `0` to refocus camera |
| Animation timing issues | Adjust playback range selector (gray bar) in timeline |
| WSL2 file watching fails | Move project into WSL2 filesystem |
