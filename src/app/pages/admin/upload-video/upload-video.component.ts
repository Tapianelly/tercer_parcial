// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-upload-video',
//   standalone: true,
//   imports: [],
//   templateUrl: './upload-video.component.html',
//   styleUrl: './upload-video.component.scss'
// })
// export class UploadVideoComponent {

// }
import { Component } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase/firebase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent {
  uploadProgress: Observable<number>;
  downloadURL: Observable<string | null>;

  constructor(private firebaseService: FirebaseService) {
    this.uploadProgress = this.firebaseService.getUploadProgress();
    this.downloadURL = this.firebaseService.getDownloadURL();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.firebaseService.uploadFile(file);
    }
  }
}
