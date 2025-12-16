import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { FileStorage } from '../../core/ports/file-storage';

@Injectable({ providedIn: 'root' })
export class FirebaseFileStorage implements FileStorage {
  constructor(private storage: Storage) {}

  async upload(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}
