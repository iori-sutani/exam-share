// filepath: c:\Users\iosut\reactproject\exam-share\frontend\src\server.ts
import express from 'express';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { validateEmail } from './emailValidator';

const app = express();
const angularApp = new AngularNodeAppEngine();

// タイムアウトを延長する設定
const SSR_TIMEOUT = 60000; // 60秒

app.use('*', (req, res, next) => {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), SSR_TIMEOUT);

  angularApp
    .handle(req, { signal: abortController.signal })
    .then((response) => {
      clearTimeout(timeout); // タイムアウトをクリア
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch((error) => {
      clearTimeout(timeout); // タイムアウトをクリア
      next(error);
    });
});

app.post('/api/validate-email', express.json(), async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const isValid = await validateEmail(email);
    return res.json({ email, isValid });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to validate email' });
  }
});

export const reqHandler = createNodeRequestHandler(app);

if (require.main === module) {
  const port = Number(process.env['PORT']) || 4000;
  const server = app.listen(port, () => {
    console.log(`SSR server listening on http://localhost:${port}`);
  });

  server.setTimeout(SSR_TIMEOUT); // サーバー全体のタイムアウト設定
}
