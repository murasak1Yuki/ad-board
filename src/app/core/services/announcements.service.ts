import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';

import { Announcement } from '@models/announcement.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  private _announcementsChanged = new Subject<Announcement[]>();
  announcementsChanged$: Observable<Announcement[]> =
    this._announcementsChanged.asObservable();
  private _announcements: Announcement[] = [];

  constructor(private _http: HttpClient) {}

  fetchAnnouncements() {
    return this._http
      .get<Announcement[]>(
        environment.firebaseConfig.databaseURL + '/announcements.json'
      )
      .pipe(
        map((announcements) => {
          return Object.values(announcements);
        }),
        tap((announcements) => {
          this._setAnnouncements(announcements);
        })
      );
  }

  storeAnnouncement(announcement: Announcement) {
    this._http
      .post(
        environment.firebaseConfig.databaseURL + '/announcements.json',
        announcement
      )
      .subscribe();
  }

  private _setAnnouncements(announcements: Announcement[]) {
    this._announcements = announcements;
    this._announcementsChanged.next(this._announcements);
  }
}
