import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

import { Announcement } from '@models/announcement.model';
import { environment } from '../../../environments/environment';

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
      .get<Announcement[]>(environment.BASE_URL + '/products.json')
      .pipe(
        tap((announcements) => {
          this._setAnnouncements(announcements);
        })
      );
  }

  private _setAnnouncements(announcements: Announcement[]) {
    this._announcements = announcements;
    this._announcementsChanged.next(this._announcements);
  }
}
