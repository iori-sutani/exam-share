import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server'; // ← ここをplatform-serverに
import { appConfig as clientConfig } from './app.config';

export const appConfig: ApplicationConfig = {
  providers: [
    ...(clientConfig?.providers ?? []),
    provideServerRendering(), // SSRに必要なサーバ用プロバイダ
  ],
};
