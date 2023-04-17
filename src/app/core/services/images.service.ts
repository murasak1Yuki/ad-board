// import { Injectable } from '@angular/core';
// import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class ImagesService {
//   constructor(private _storage: AngularFireStorage) {}
//
//   async uploadImages() {
//     for (let image of this.selectedImages) {
//       const filePath = `images/${new Date().getTime()}_${image.name}`;
//       const storage = getStorage();
//       const fileRef = ref(storage, filePath);
//       await this._storage.upload(filePath, image);
//       getDownloadURL(fileRef).then((url) => {
//         this.imageUrls.push(url);
//       });
//     }
//   }
// }
