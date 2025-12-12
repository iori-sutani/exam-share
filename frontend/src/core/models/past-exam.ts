export interface PastExam {
  id?: string;
  subject: string;
  term: 'spring' | 'fall';
  year: number;
  memo?: string;
  photo?: string; // URL to uploaded image
  email: string;
  createdAt: Date;
}

export type NewPastExam = Omit<PastExam, 'id' | 'createdAt'> & { createdAt?: Date };
