import { spawn } from 'node:child_process';
import https from 'node:https';
import path from 'node:path';

const HOST = '127.0.0.1';
const PORT = 18766;
const BASE_URL = `https://${HOST}:${PORT}`;
const START_TIMEOUT_MS = 90_000;
const ROUTES = ['/playbooks', '/report/test-token', '/api/ping'];
const STOP_TIMEOUT_MS = 5_000;

const wranglerBin = path.resolve('node_modules/wrangler/bin/wrangler.js');
const wranglerArgs = [
  wranglerBin,
  'dev',
  '--config',
  'dist/server/wrangler.json',
  '--local',
  '--local-protocol',
  'https',
  '--upstream-protocol',
  'https',
  '--port',
  String(PORT),
  '--inspector-port',
  String(PORT + 1000),
  '--persist-to',
  '.wrangler/smoke-worker-ssr',
  '--var',
  'BETTER_AUTH_SECRET:smoke-test-secret-0123456789-abcdef',
  '--show-interactive-dev-session=false',
];
const worker = spawn(process.execPath, wranglerArgs, {
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
worker.stdout.on('data', (chunk) => {
  output += chunk.toString();
});
worker.stderr.on('data', (chunk) => {
  output += chunk.toString();
});

async function waitForWorker() {
  const deadline = Date.now() + START_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (worker.exitCode !== null) {
      throw new Error(`Wrangler exited before startup.\n${output}`);
    }

    if (output.includes(`Ready on ${BASE_URL}`)) return;

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Wrangler did not start within 90 seconds.\n${output}`);
}

async function stopWorker() {
  if (worker.exitCode !== null) return;

  await new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const timeout = setTimeout(() => {
      worker.kill('SIGKILL');
      finish();
    }, STOP_TIMEOUT_MS);

    worker.once('close', () => {
      clearTimeout(timeout);
      finish();
    });

    if (!worker.kill('SIGTERM')) {
      clearTimeout(timeout);
      finish();
    }
  });
}

async function requestRoute(route: string) {
  return await new Promise<{ location?: string; status: number }>(
    (resolve, reject) => {
      const request = https.request(
        {
          hostname: 'aeocheck.xyz',
          port: PORT,
          path: route,
          method: 'GET',
          lookup: (_hostname, options, callback) => {
            if (options.all) {
              callback(null, [{ address: HOST, family: 4 }]);
              return;
            }
            callback(null, HOST, 4);
          },
          rejectUnauthorized: false,
        },
        (response) => {
          response.resume();
          response.once('end', () =>
            resolve({
              location: response.headers.location,
              status: response.statusCode ?? 0,
            })
          );
        }
      );

      request.setTimeout(10_000, () => {
        request.destroy(new Error(`Request timed out for ${route}`));
      });
      request.once('error', reject);
      request.end();
    }
  );
}

async function main() {
  try {
    await waitForWorker();

    for (const route of ROUTES) {
      const { status } = await requestRoute(route);
      console.log(`${status} ${route}`);

      if (status !== 200) {
        throw new Error(
          `Worker smoke failed for ${route}: HTTP ${status}\n${output}`
        );
      }
    }

    const repeatedPage = await requestRoute('/blog?page=2&page=3');
    console.log(
      `${repeatedPage.status} /blog?page=2&page=3 -> ${repeatedPage.location}`
    );
    if (repeatedPage.status !== 301 || repeatedPage.location !== '/blog') {
      throw new Error(
        `Worker smoke failed for repeated blog page parameters: HTTP ${repeatedPage.status}, Location ${repeatedPage.location}\n${output}`
      );
    }
  } finally {
    await stopWorker();
  }
}

await main();
