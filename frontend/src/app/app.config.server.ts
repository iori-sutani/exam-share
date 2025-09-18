import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(routes),
    // 他のプロバイダー
  ]
};
