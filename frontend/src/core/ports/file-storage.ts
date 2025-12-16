export abstract class FileStorage {
  /**
   * Uploads a file to the specified path and returns the download URL.
   * @param path The path where the file should be stored (e.g., 'posts/math/exam.jpg')
   * @param file The file to upload
   */
  abstract upload(path: string, file: File): Promise<string>;
}
