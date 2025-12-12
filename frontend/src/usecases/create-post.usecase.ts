import { Post, NewPost } from '../core/models/post';
import { PostRepository } from '../core/ports/post-repository';
import { EmailValidator } from '../core/ports/email-validator';

/**
 * Use case that encapsulates business rules for creating a Post.
 *
 * Responsibilities:
 * - Validate required/length rules for fields
 * - Verify email via EmailValidator port
 * - Normalize/complete the Post object and delegate persistence to PostRepository
 */
export class CreatePostUseCase {
  constructor(private repo: PostRepository, private emailValidator: EmailValidator) {}

  async execute(input: NewPost): Promise<string> {
    // Basic validation rules
    const subject = (input.subject ?? '').trim();
    if (!subject) throw new Error('subject_required');
    if (subject.length > 100) throw new Error('subject_too_long');

    const current = new Date().getFullYear();
    if (typeof input.year !== 'number' || input.year < current - 8 || input.year > current) {
      throw new Error('invalid_year');
    }

    if (!['spring', 'fall'].includes(input.term)) throw new Error('invalid_term');

    if (input.memo && input.memo.length > 500) throw new Error('memo_too_long');

    if (!input.email) throw new Error('email_required');

    const isEmailOk = await this.emailValidator.validate(input.email);
    if (!isEmailOk) throw new Error('email_invalid');

    const post: Post = {
      subject,
      term: input.term,
      year: input.year,
      memo: input.memo ?? '',
      photo: input.photo,
      email: input.email,
      createdAt: input.createdAt ?? new Date(),
    };

    return this.repo.create(post);
  }
}
