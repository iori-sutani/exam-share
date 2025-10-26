# ExamShareexam-share-frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## SSR and ZeroBounce

- SSR is enabled via `src/server.ts`. A server-only email validation route is available at `POST /api/validate-email`.
- The ZeroBounce API key must be provided via environment variable `ZEROBOUNCE_API_KEY` at runtime (server-side only). See `.env.example` for the variable name.

### Run SSR locally

1. Build the app (SSR bundles included):

   ```bash
   npm run build
   ```

2. Start the Node SSR server with your API key:

   ```bash
   set ZEROBOUNCE_API_KEY=your_key_here && npm run serve:ssr:exam-share-frontend
   ```

   On macOS/Linux:

   ```bash
   ZEROBOUNCE_API_KEY=your_key_here npm run serve:ssr:exam-share-frontend
   ```

3. Open `http://localhost:4000/`.

### How it works

- Client code calls `POST /api/validate-email` (see `src/app/services/email.service.ts`).
- The Node server handles the request in `src/server.ts` and uses a server-only helper `src/server/emailValidator.ts` to call the ZeroBounce API with the secret key.
- The API key is never shipped to the browser.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
