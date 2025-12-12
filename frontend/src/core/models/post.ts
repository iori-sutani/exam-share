export interface Post {
  id?: string;
  subject: string;
  term: 'spring' | 'fall';
  year: number;
  memo?: string;
  photo?: string; // URL to uploaded image
  email: string;
  createdAt: Date;
}

export type NewPost = Omit<Post, 'id' | 'createdAt'> & { createdAt?: Date };
