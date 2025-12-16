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
import { FileStorage } from '../core/ports/file-storage';
import { FirebaseFileStorage } from '../infrastructure/storage/firebase-file-storage';
import { SubjectRepository } from '../core/ports/subject-repository';
import { FirestoreSubjectRepository } from '../infrastructure/repositories/firestore-subject.repository';

// Use Cases
import { CreatePastExamUseCase } from '../usecases/create-past-exam.usecase';
import { GetRecentPastExamsUseCase } from '../usecases/get-recent-past-exams.usecase';
import { GetAllSubjectsUseCase } from '../usecases/get-all-subjects.usecase';
import { GetPostsBySubjectUseCase } from '../usecases/get-posts-by-subject.usecase';

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
    { provide: FileStorage, useClass: FirebaseFileStorage },
    { provide: SubjectRepository, useClass: FirestoreSubjectRepository },

    // Provide Use Cases (Factory Provider)
    {
      provide: CreatePastExamUseCase,
      useFactory: (repo: PastExamRepository, validator: EmailValidator, storage: FileStorage) =>
        new CreatePastExamUseCase(repo, validator, storage),
      deps: [PastExamRepository, EmailValidator, FileStorage]
    },
    {
      provide: GetRecentPastExamsUseCase,
      useFactory: (repo: PastExamRepository) => new GetRecentPastExamsUseCase(repo),
      deps: [PastExamRepository]
    },
    {
      provide: GetAllSubjectsUseCase,
      useFactory: (repo: SubjectRepository) => new GetAllSubjectsUseCase(repo),
      deps: [SubjectRepository]
    },
    {
      provide: GetPostsBySubjectUseCase,
      useFactory: (repo: PastExamRepository) => new GetPostsBySubjectUseCase(repo),
      deps: [PastExamRepository]
    }
  ],
};
