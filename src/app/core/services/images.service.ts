import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from, map, mergeMap, Observable, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(private _storage: AngularFireStorage) {}

  uploadImages(images: Set<File>): Observable<string[]> {
    return from(images).pipe(
      mergeMap((image) => {
        const filePath = `images/${new Date().getTime()}_${image.name}`;
        return this._storage.upload(filePath, image);
      }),
      mergeMap((uploadTask) => uploadTask!.ref.getDownloadURL()),
      map((url) => url as string),
      toArray()
    );
  }
}
