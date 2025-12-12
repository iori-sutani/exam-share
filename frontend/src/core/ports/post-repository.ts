import { Post } from '../models/post';

export interface PostRepository {
  /**
   * Create a post and return the created document id.
   */
  create(post: Post): Promise<string>;

  // future: list/get/update/delete
}
