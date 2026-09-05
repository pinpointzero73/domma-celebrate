/**
 * A static file server for `demo/`, so the demo page can be opened without
 * pulling in a dev-server dependency. `file://` will not do: the ESM build
 * fetches its theme chunks, and module imports over `file://` are blocked.
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relative = normalize(path === '/' ? '/demo/index.html' : path).replace(/^(\.\.[/\\])+/, '');
  const file = join(root, relative);

  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
  }
}).listen(port, () => {
  console.log(`domma-celebrate demo: http://localhost:${port}/`);
});
