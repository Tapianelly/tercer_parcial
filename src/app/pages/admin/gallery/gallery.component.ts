import { routes } from '@/app/app.routes';
import { Component, OnInit, inject, signal } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { Storage, listAll, ref, getDownloadURL,deleteObject } from '@angular/fire/storage';
import swalt from "sweetalert2"

type ImageStorage = {
  name: string;
  url: string;
};

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export default class GalleryComponent implements OnInit {
  private readonly _storage = inject(Storage);
  private readonly router = inject(Router)

  images = signal<ImageStorage[]>([]);

  async ngOnInit() {
    const reference = ref(this._storage, 'uploads');
    const images = await listAll(reference);

    for (const image of images.items) {
      const url = await getDownloadURL(image);
      this.images.update((oldImages) => {
        return [...oldImages, { url, name: image.name }];
      });
    }
    console.log(this.images());

  }
  async deleteImage(imageName: string) {
    console.log(imageName)
    const reference = ref(this._storage,`uploads/${imageName}`)
    deleteObject(reference).then(() => {
      swalt.fire({
        icon: "success",
        title: `<div>
                   <h2 class="text-2xl font-bold text-blue-900">Archivo subido con exito</h2>
              </div>`,
        showConfirmButton: false,
        timer: 2000,
        background: '#1a202c'
      })
      this.router.navigateByUrl('dashboard/gallery')
    }).catch((error) => {
    console.log(error)
    });
    
  }  
}