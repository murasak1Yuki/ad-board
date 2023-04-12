import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

import { Announcement } from '@models/announcement.model';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  private _announcementsChanged = new Subject<Announcement[]>();
  announcementsChanged$: Observable<Announcement[]> = this._announcementsChanged.asObservable();
  private _announcements: Announcement[] = [];

  constructor(private _http: HttpClient) {}

  fetchAnnouncements() {
    return this._http
      .get<Announcement[]>(
        'https://announcements-board-default-rtdb.europe-west1.firebasedatabase.app/products.json'
      )
      .pipe(
        tap((announcements) => {
          this.setAnnouncements(announcements);
        })
      );
  }

  private setAnnouncements(announcements: Announcement[]) {
    this._announcements = announcements;
    this._announcementsChanged.next(this._announcements);
  }
}
