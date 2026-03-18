/**
 * Motion Canvas Agent Client
 *
 * Runtime plugin + HMR client that exposes Player control, settings,
 * scene graph inspection, and canvas capture via WebSocket.
 *
 * Usage in project.ts:
 *   import {agentClient} from './agent-client';
 *
 *   export default makeProject({
 *     plugins: [agentClient()],
 *     scenes: [...],
 *   });
 */

import type {Plugin, Player, Renderer, Presenter, Project} from '@motion-canvas/core';

let playerInstance: Player | null = null;
let rendererInstance: Renderer | null = null;
let projectInstance: Project | null = null;

export function agentClient(): Plugin {
  return {
    name: 'agent-client',

    project(project) {
      projectInstance = project;
    },

    player(player) {
      playerInstance = player;

      if (import.meta.hot) {
        const reportState = () => {
          const scene = player.playback.currentScene;
          import.meta.hot!.send('agent:state', {
            connected: true,
            frame: player.playback.frame,
            duration: player.playback.duration,
            fps: player.status.fps,
            sceneName: scene?.name ?? null,
          });
        };

        player.onFrameChanged.subscribe(reportState);
        player.onDurationChanged.subscribe(reportState);
        reportState();
      }
    },

    renderer(renderer) {
      rendererInstance = renderer;
    },
  };
}

// Serialize the scene graph from a node recursively
function serializeNode(node: any, depth = 0, maxDepth = 10): any {
  if (depth > maxDepth) return {type: '...truncated'};

  const result: any = {
    type: node.constructor?.name ?? 'Node',
    key: node.key ?? null,
  };

  // Position
  try {
    const pos = node.position?.();
    if (pos) result.position = {x: Math.round(pos.x), y: Math.round(pos.y)};
  } catch {}

  // Size
  try {
    const size = node.size?.();
    if (size) result.size = {width: Math.round(size.x), height: Math.round(size.y)};
  } catch {}

  // Opacity
  try {
    const opacity = node.opacity?.();
    if (opacity !== undefined && opacity !== 1) result.opacity = opacity;
  } catch {}

  // Fill
  try {
    const fill = node.fill?.();
    if (fill) result.fill = String(fill);
  } catch {}

  // Text
  try {
    const text = node.text?.();
    if (text) result.text = String(text).substring(0, 100);
  } catch {}

  // Children
  try {
    const children = node.peekChildren?.() ?? node.children?.() ?? [];
    if (children.length > 0) {
      result.children = children.map((c: any) => serializeNode(c, depth + 1, maxDepth));
    }
  } catch {}

  return result;
}

if (import.meta.hot) {
  function findCanvas(): HTMLCanvasElement | null {
    return document.querySelector('canvas');
  }

  function getMetaFields(): any {
    if (!projectInstance) return null;
    const meta = (projectInstance as any).meta;
    if (!meta) return null;
    return meta;
  }

  import.meta.hot.on('agent:request', async (data: any) => {
    const {id, type, ...params} = data;

    try {
      let response: any = {id, ok: true};

      switch (type) {
        // === Playback Control ===

        case 'seek': {
          if (!playerInstance) throw new Error('Player not initialized');
          playerInstance.requestSeek(params.frame ?? 0);
          await new Promise<void>((resolve) => setTimeout(resolve, 300));
          response.frame = playerInstance.playback.frame;
          break;
        }

        case 'screenshot': {
          if (!playerInstance) throw new Error('Player not initialized');
          playerInstance.requestRender();
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          const canvas = findCanvas();
          if (!canvas) throw new Error('Canvas not found');
          response.data = canvas.toDataURL('image/png');
          response.frame = playerInstance.playback.frame;
          break;
        }

        case 'next-frame': {
          if (!playerInstance) throw new Error('Player not initialized');
          playerInstance.requestNextFrame();
          await new Promise((r) => setTimeout(r, 150));
          response.frame = playerInstance.playback.frame;
          break;
        }

        case 'prev-frame': {
          if (!playerInstance) throw new Error('Player not initialized');
          playerInstance.requestPreviousFrame();
          await new Promise((r) => setTimeout(r, 150));
          response.frame = playerInstance.playback.frame;
          break;
        }

        case 'play': {
          if (!playerInstance) throw new Error('Player not initialized');
          playerInstance.togglePlayback(true);
          break;
        }

        case 'pause': {
          if (!playerInstance) throw new Error('Player not initialized');
          playerInstance.togglePlayback(false);
          break;
        }

        case 'status': {
          const scene = playerInstance?.playback.currentScene;
          response.frame = playerInstance?.playback.frame ?? 0;
          response.duration = playerInstance?.playback.duration ?? 0;
          response.fps = playerInstance?.status.fps ?? 60;
          response.connected = !!playerInstance;
          response.sceneName = scene?.name ?? null;
          break;
        }

        // === Settings Control ===

        case 'get-settings': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          response.settings = {
            background: String(meta.shared.background.get() ?? 'null'),
            range: meta.shared.range.get(),
            size: (() => { const s = meta.shared.size.get(); return {x: s.x, y: s.y}; })(),
            previewFps: meta.preview.fps.get(),
            previewScale: meta.preview.resolutionScale.get(),
            renderingFps: meta.rendering.fps.get(),
            renderingScale: meta.rendering.resolutionScale.get(),
            exporter: meta.rendering.exporter.get(),
          };
          break;
        }

        case 'set-background': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          meta.shared.background.set(params.color ?? null);
          break;
        }

        case 'set-range': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          meta.shared.range.set([params.start ?? 0, params.end ?? Infinity]);
          break;
        }

        case 'set-size': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          meta.shared.size.set({x: params.width ?? 1920, y: params.height ?? 1080});
          // Reconfigure player with new settings
          if (playerInstance) {
            playerInstance.configure(meta.getFullPreviewSettings());
          }
          await new Promise((r) => setTimeout(r, 200));
          break;
        }

        case 'set-preview-fps': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          meta.preview.fps.set(params.fps ?? 60);
          if (playerInstance) {
            playerInstance.configure(meta.getFullPreviewSettings());
          }
          break;
        }

        case 'set-preview-scale': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          meta.preview.resolutionScale.set(params.scale ?? 1);
          if (playerInstance) {
            playerInstance.configure(meta.getFullPreviewSettings());
          }
          break;
        }

        case 'set-rendering-fps': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          meta.rendering.fps.set(params.fps ?? 60);
          break;
        }

        case 'set-rendering-scale': {
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          meta.rendering.resolutionScale.set(params.scale ?? 1);
          break;
        }

        // === Rendering ===

        case 'render': {
          if (!rendererInstance) throw new Error('Renderer not available');
          const meta = getMetaFields();
          if (!meta) throw new Error('Project metadata not available');
          const settings = meta.getFullRenderingSettings();
          // Override with any provided params
          if (params.fps) settings.fps = params.fps;
          if (params.range) settings.range = params.range;
          if (params.exporter) settings.exporter = {name: params.exporter, options: {}};
          response.settings = settings;
          // Render asynchronously — don't await (it takes a long time)
          rendererInstance.render(settings).catch((err: any) => {
            if (import.meta.hot) {
              import.meta.hot.send('agent:error', {message: `Render error: ${err.message}`});
            }
          });
          response.message = 'Render started';
          break;
        }

        case 'render-abort': {
          if (!rendererInstance) throw new Error('Renderer not available');
          rendererInstance.abort();
          response.message = 'Render aborted';
          break;
        }

        // === Scene Info ===

        case 'get-scenes': {
          if (!projectInstance) throw new Error('Project not available');
          const scenes = projectInstance.scenes ?? [];
          response.scenes = scenes.map((s: any) => ({
            name: s.name,
          }));
          response.currentScene = playerInstance?.playback.currentScene?.name ?? null;
          break;
        }

        // === Scene Graph ===

        case 'get-scene-graph': {
          if (!playerInstance) throw new Error('Player not initialized');
          const scene = playerInstance.playback.currentScene as any;
          if (!scene) throw new Error('No active scene');
          const view = scene.getView?.();
          if (!view) throw new Error('No view in current scene');
          const maxDepth = params.maxDepth ?? 5;
          response.scene = scene.name;
          response.graph = serializeNode(view, 0, maxDepth);
          break;
        }

        // === Threads ===

        case 'get-threads': {
          if (!playerInstance) throw new Error('Player not initialized');
          const scene = playerInstance.playback.currentScene as any;
          if (!scene) throw new Error('No active scene');
          // Thread info is limited — we can report what's available
          const slides = playerInstance.playback.slides ?? [];
          response.scene = scene.name;
          response.slides = slides.map((s: any) => ({
            name: s.name,
            id: s.id,
          }));
          break;
        }

        default:
          response = {id, error: `Unknown command: ${type}`};
      }

      import.meta.hot!.send('agent:response', response);
    } catch (err: any) {
      import.meta.hot!.send('agent:response', {
        id,
        error: err.message ?? 'Unknown error',
      });
    }
  });

  // Forward errors to server
  window.addEventListener('error', (event) => {
    import.meta.hot!.send('agent:error', {
      message: event.message,
      stack: event.error?.stack,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    import.meta.hot!.send('agent:error', {
      message: String(event.reason),
      stack: event.reason?.stack,
    });
  });

  import.meta.hot.send('agent:state', {connected: true});
  console.log('[agent] Motion Canvas Agent client loaded');
}
