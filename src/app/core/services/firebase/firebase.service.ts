// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class FirebaseService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { environment } from '../../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDownloadURL, ref, uploadBytesResumable ,deleteObject} from 'firebase/storage';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private storage = getStorage(this.app);

  uploadProgress = new BehaviorSubject<number>(0);
  downloadURL = new BehaviorSubject<string | null>(null);

  constructor() {}

  uploadFile(file: File): void {
    const filePath = `videos/${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadProgress.next(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.downloadURL.next(downloadURL);
        });
      }
    );
  }

  getUploadProgress(): Observable<number> {
    return this.uploadProgress.asObservable();
  }

  getDownloadURL(): Observable<string | null> {
    return this.downloadURL.asObservable();
  }

  async deleteImage(imageName: string): Promise<void> {
    const imageRef = ref(this.storage, `uploads/${imageName}`);
    try {
      await deleteObject(imageRef);
      console.log('Imagen eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la imagen: ', error);
      throw error;
    }
  }
}
