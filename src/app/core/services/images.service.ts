import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(private _storage: AngularFireStorage) {}

  async uploadImages(images: Set<File>) {
    const imageUrls: string[] = [];
    for (let image of images) {
      const filePath = `images/${new Date().getTime()}_${image.name}`;
      const uploadTask = await this._storage.upload(filePath, image);
      const url = await uploadTask.ref.getDownloadURL();
      imageUrls.push(url);
    }
    return imageUrls;
  }
}
