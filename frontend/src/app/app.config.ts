import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { firebaseConfig } from '../environments/environment';

// Ports & Adapters
import { EmailValidator } from '../core/ports/email-validator';
import { EmailApiAdapter } from '../infrastructure/http/email-api-adapter';
import { PastExamRepository } from '../core/ports/past-exam-repository';
import { FirestorePastExamRepository } from '../infrastructure/repositories/firestore-past-exam.repository';

// Use Cases
import { CreatePastExamUseCase } from '../usecases/create-past-exam.usecase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), // Hydration を使っているなら
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    // Bind Ports to Adapters
    { provide: EmailValidator, useClass: EmailApiAdapter },
    { provide: PastExamRepository, useClass: FirestorePastExamRepository },

    // Provide Use Cases (Factory Provider)
    {
      provide: CreatePastExamUseCase,
      useFactory: (repo: PastExamRepository, validator: EmailValidator) => new CreatePastExamUseCase(repo, validator),
      deps: [PastExamRepository, EmailValidator]
    }
  ],
};
