/**
 * Motion Canvas Agent Plugin
 *
 * A Vite plugin that adds HTTP endpoints for external agent control.
 * Communicates with the browser via Vite's HMR WebSocket to control
 * the Motion Canvas Player (seek, screenshot, error monitoring).
 *
 * Usage in vite.config.ts:
 *   import {agentPlugin} from './agent-plugin';
 *   plugins: [motionCanvas(), agentPlugin()]
 */

import type {Plugin, ViteDevServer} from 'vite';
import fs from 'fs';
import path from 'path';

export interface AgentPluginOptions {
  /** Directory to save screenshots (default: './screenshots') */
  screenshotDir?: string;
}

export function agentPlugin(options: AgentPluginOptions = {}): Plugin {
  const screenshotDir = options.screenshotDir ?? './screenshots';
  let server: ViteDevServer;

  // Pending requests waiting for browser responses
  const pending = new Map<
    string,
    {resolve: (value: any) => void; reject: (err: any) => void; timeout: NodeJS.Timeout}
  >();

  let requestId = 0;

  // Latest state pushed from browser
  let browserState: {
    connected: boolean;
    frame: number;
    duration: number;
    fps: number;
    paused: boolean;
    sceneName: string | null;
    errors: Array<{message: string; stack?: string}>;
  } = {
    connected: false,
    frame: 0,
    duration: 0,
    fps: 60,
    paused: true,
    sceneName: null,
    errors: [],
  };

  function sendToBrowser(type: string, data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = String(++requestId);
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timeout waiting for browser response to ${type}`));
      }, 10000);

      pending.set(id, {resolve, reject, timeout});
      server.ws.send('agent:request', {id, type, ...data});
    });
  }

  function parseBody(req: any): Promise<any> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk: string) => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  }

  function jsonResponse(res: any, data: any, status = 200) {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  }

  return {
    name: 'motion-canvas:agent',

    configureServer(srv) {
      server = srv;

      // Listen for browser responses
      server.ws.on('agent:response', (data: any) => {
        const p = pending.get(data.id);
        if (p) {
          clearTimeout(p.timeout);
          pending.delete(data.id);
          if (data.error) {
            p.reject(new Error(data.error));
          } else {
            p.resolve(data);
          }
        }
      });

      // Listen for state updates pushed from browser
      server.ws.on('agent:state', (data: any) => {
        browserState = {...browserState, ...data, connected: true};
      });

      // Listen for error reports from browser
      server.ws.on('agent:error', (data: any) => {
        browserState.errors.push({
          message: data.message,
          stack: data.stack,
        });
      });

      // HTTP endpoints
      server.middlewares.use((req: any, res: any, next: any) => {
        const fullUrl = req.url?.split('?')[0] ?? '';
        if (!fullUrl.startsWith('/__agent/')) return next();
        const route = fullUrl.replace('/__agent', '');

        const handle = async () => {
          try {
            // GET /status
            if (route === '/status' && req.method === 'GET') {
              return jsonResponse(res, browserState);
            }

            // GET /errors
            if (route === '/errors' && req.method === 'GET') {
              return jsonResponse(res, {errors: browserState.errors});
            }

            // POST /clear-errors
            if (route === '/clear-errors' && req.method === 'POST') {
              browserState.errors = [];
              return jsonResponse(res, {ok: true});
            }

            // POST /seek
            if (route === '/seek' && req.method === 'POST') {
              const body = await parseBody(req);
              const frame = body.frame ?? 0;
              const result = await sendToBrowser('seek', {frame});
              return jsonResponse(res, {ok: true, frame: result.frame});
            }

            // POST /screenshot
            if (route === '/screenshot' && req.method === 'POST') {
              const body = await parseBody(req);
              const name = body.name ?? `frame-${browserState.frame}`;

              const result = await sendToBrowser('screenshot');
              const base64Data = result.data.replace(/^data:image\/png;base64,/, '');

              if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, {recursive: true});
              }

              const filePath = path.join(screenshotDir, `${name}.png`);
              fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

              return jsonResponse(res, {ok: true, path: filePath, frame: result.frame});
            }

            // POST /screenshot-base64
            if (route === '/screenshot-base64' && req.method === 'POST') {
              const result = await sendToBrowser('screenshot');
              return jsonResponse(res, {ok: true, data: result.data, frame: result.frame});
            }

            // POST /next-frame
            if (route === '/next-frame' && req.method === 'POST') {
              const result = await sendToBrowser('next-frame');
              return jsonResponse(res, {ok: true, frame: result.frame});
            }

            // POST /prev-frame
            if (route === '/prev-frame' && req.method === 'POST') {
              const result = await sendToBrowser('prev-frame');
              return jsonResponse(res, {ok: true, frame: result.frame});
            }

            // POST /play
            if (route === '/play' && req.method === 'POST') {
              await sendToBrowser('play');
              return jsonResponse(res, {ok: true});
            }

            // POST /pause
            if (route === '/pause' && req.method === 'POST') {
              await sendToBrowser('pause');
              return jsonResponse(res, {ok: true});
            }

            // === Settings ===

            // GET /settings
            if (route === '/settings' && req.method === 'GET') {
              const result = await sendToBrowser('get-settings');
              return jsonResponse(res, result.settings);
            }

            // POST /settings/background
            if (route === '/settings/background' && req.method === 'POST') {
              const body = await parseBody(req);
              await sendToBrowser('set-background', {color: body.color});
              return jsonResponse(res, {ok: true});
            }

            // POST /settings/range
            if (route === '/settings/range' && req.method === 'POST') {
              const body = await parseBody(req);
              await sendToBrowser('set-range', {start: body.start, end: body.end});
              return jsonResponse(res, {ok: true});
            }

            // POST /settings/size
            if (route === '/settings/size' && req.method === 'POST') {
              const body = await parseBody(req);
              await sendToBrowser('set-size', {width: body.width, height: body.height});
              return jsonResponse(res, {ok: true});
            }

            // POST /settings/preview-fps
            if (route === '/settings/preview-fps' && req.method === 'POST') {
              const body = await parseBody(req);
              await sendToBrowser('set-preview-fps', {fps: body.fps});
              return jsonResponse(res, {ok: true});
            }

            // POST /settings/preview-scale
            if (route === '/settings/preview-scale' && req.method === 'POST') {
              const body = await parseBody(req);
              await sendToBrowser('set-preview-scale', {scale: body.scale});
              return jsonResponse(res, {ok: true});
            }

            // POST /settings/rendering-fps
            if (route === '/settings/rendering-fps' && req.method === 'POST') {
              const body = await parseBody(req);
              await sendToBrowser('set-rendering-fps', {fps: body.fps});
              return jsonResponse(res, {ok: true});
            }

            // POST /settings/rendering-scale
            if (route === '/settings/rendering-scale' && req.method === 'POST') {
              const body = await parseBody(req);
              await sendToBrowser('set-rendering-scale', {scale: body.scale});
              return jsonResponse(res, {ok: true});
            }

            // === Rendering ===

            // POST /render
            if (route === '/render' && req.method === 'POST') {
              const body = await parseBody(req);
              const result = await sendToBrowser('render', body);
              return jsonResponse(res, {ok: true, message: result.message});
            }

            // POST /render/abort
            if (route === '/render/abort' && req.method === 'POST') {
              const result = await sendToBrowser('render-abort');
              return jsonResponse(res, {ok: true, message: result.message});
            }

            // === Scene Info ===

            // GET /scenes
            if (route === '/scenes' && req.method === 'GET') {
              const result = await sendToBrowser('get-scenes');
              return jsonResponse(res, {scenes: result.scenes, currentScene: result.currentScene});
            }

            // === Scene Graph ===

            // GET /scene-graph
            if (route === '/scene-graph' && req.method === 'GET') {
              const result = await sendToBrowser('get-scene-graph', {maxDepth: 5});
              return jsonResponse(res, {scene: result.scene, graph: result.graph});
            }

            // === Threads / Slides ===

            // GET /threads
            if (route === '/threads' && req.method === 'GET') {
              const result = await sendToBrowser('get-threads');
              return jsonResponse(res, {scene: result.scene, slides: result.slides});
            }

            return jsonResponse(res, {error: 'Unknown agent endpoint'}, 404);
          } catch (err: any) {
            return jsonResponse(res, {error: err.message}, 500);
          }
        };

        handle();
      });
    },
  };
}
