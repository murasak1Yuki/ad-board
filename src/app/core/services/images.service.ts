import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  throwError,
  toArray,
} from 'rxjs';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;

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
      catchError(this._handleError),
      map((url) => url as string),
      toArray()
    );
  }

  private _handleError(error: FirebaseError) {
    const errorMessageMap: { [errorCode: string]: string } = {
      'storage/unknown': 'Произошла неизвестная ошибка.',
      'storage/object-not-found': 'По желаемой ссылке объект не существует.',
      'storage/unauthorized': 'Пользователь не авторизован для выполнения желаемого действия.',
    };
    const errorMessage = errorMessageMap[error.code] || 'Произошла ошибка.';
    return throwError(() => errorMessage);
  }
}
