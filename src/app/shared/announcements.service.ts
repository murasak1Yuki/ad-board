import { Injectable } from '@angular/core';

import { Announcement } from './announcement.model';
import { HttpClient } from '@angular/common/http';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  announcementsChanged = new Subject<Announcement[]>();
  private announcements: Announcement[] = [];

  constructor(private _http: HttpClient) {}

  getAnnouncements(): Announcement[] {
    return this.announcements.slice();
  }

  setAnnouncements(announcements: Announcement[]) {
    this.announcements = announcements;
    this.announcementsChanged.next(this.announcements.slice());
  }

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
}
