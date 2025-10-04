// app/app.config.ts（例）
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { environment } from '../environments/environment';
import { firebaseConfig } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), // Hydration を使っているなら
    provideFirebaseApp(() => initializeApp(firebaseConfig))
    // 他のクライアント側プロバイダ...
  ],
};
