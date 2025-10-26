// filepath: c:\Users\iosut\reactproject\exam-share\frontend\src\server.ts
import express from 'express';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { validateEmail, getEmailStatus } from './server/emailValidator';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// Import internal setters to register manifests at runtime
// eslint-disable-next-line import/no-internal-modules
import {
  ɵsetAngularAppEngineManifest as setAngularAppEngineManifest,
  ɵsetAngularAppManifest as setAngularAppManifest,
} from '@angular/ssr';

// Defer loading of SSR manifests and engine creation to avoid top-level await during build
const manifestsReady = (async () => {
  try {
    const [engineManifestMod, appManifestMod] = await Promise.all([
      import(new URL('./angular-app-engine-manifest.mjs', import.meta.url).toString()),
      import(new URL('./angular-app-manifest.mjs', import.meta.url).toString()),
    ]);
    if (engineManifestMod?.default) {
      setAngularAppEngineManifest(engineManifestMod.default as any);
    }
    if (appManifestMod?.default) {
      setAngularAppManifest(appManifestMod.default as any);
    }
  } catch (e) {
    console.warn(
      'Warning: Failed to preload Angular SSR manifests (expected before build).',
      e
    );
  }
})();

const app = express();
let angularApp: AngularNodeAppEngine | undefined;

// Resolve path to browser build output relative to compiled server file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const browserDistPath = resolve(__dirname, '../browser');

async function getAngularApp(): Promise<AngularNodeAppEngine> {
  if (!angularApp) {
    try {
      await manifestsReady;
    } catch {
      // continue even if manifests could not be eagerly loaded; engine may still work in dev
    }
    angularApp = new AngularNodeAppEngine();
  }
  return angularApp;
}

const SSR_TIMEOUT = 60000; // 60秒

// ★ /api に JSON パーサ
app.use('/api', express.json());

// Relaxed ZeroBounce policy (env-configurable)
const BLOCKED_STATUSES = new Set(['spamtrap', 'abuse', 'do_not_mail']);
function isAllowedStatus(status: string): boolean {
  if (!status) return false;
  if (BLOCKED_STATUSES.has(status)) return false;
  const allowEnv = process.env['ZEROBOUNCE_ALLOW'];
  if (allowEnv) {
    const allowed = new Set(
      allowEnv
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    );
    return allowed.has(status);
  }
  // Default: allow 'valid' and 'catch-all'
  return status === 'valid' || status === 'catch-all';
}

// ★ API を先に定義（SSR より前）
app.post('/api/validate-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const status = await getEmailStatus(email);
    const isValid = isAllowedStatus(String(status));
    return res.json({ email, isValid, status });
  } catch (error) {
    console.error('validate-email error:', error);
    return res.status(500).json({ error: 'Failed to validate email' });
  }
});

// Optional debug GET endpoint: /api/validate-email?email=...
app.get('/api/validate-email', async (req, res) => {
  const qEmail = (req.query as any)['email'];
  const email = Array.isArray(qEmail) ? (qEmail[0] as string) : ((qEmail as string) || '');
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const status = await getEmailStatus(email);
    const isValid = isAllowedStatus(String(status));
    return res.json({ email, isValid, status });
  } catch (error) {
    console.error('validate-email error:', error);
    return res.status(500).json({ error: 'Failed to validate email' });
  }
});

// Serve static browser assets for CSR and static files
app.use(express.static(browserDistPath, { maxAge: '1y', index: false }));

// ★ 最後に SSR の catch-all
app.use('*', (req, res, next) => {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), SSR_TIMEOUT);

  getAngularApp()
    .then((engine) => engine.handle(req, { signal: abortController.signal }))
    .then((response) => {
      clearTimeout(timeout);
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch((error) => {
      clearTimeout(timeout);
      next(error);
    });
});

// Fallback to CSR index.html if SSR didn’t produce a response
app.get('*', (req, res) => {
  res.sendFile(join(browserDistPath, 'index.html'));
});

export const reqHandler = createNodeRequestHandler(app);

function isDirectRun(): boolean {
  try {
    const thisPath = new URL(import.meta.url).pathname;
    const entry = process.argv[1]
      ? new URL(`file://${process.argv[1]}`).pathname
      : '';
    return thisPath === entry;
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  const port = Number(process.env['PORT']) || 4000;
  const server = app.listen(port, () => {
    console.log(`SSR server listening on http://localhost:${port}`);
  });
  server.setTimeout(SSR_TIMEOUT);
}
