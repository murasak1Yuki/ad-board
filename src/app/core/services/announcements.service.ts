import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';

import { Announcement } from '@models/announcement.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  private _announcementsChanged: Subject<Announcement[]> = new Subject<Announcement[]>();
  public announcementsChanged$: Observable<Announcement[]> = this._announcementsChanged.asObservable();
  private _announcements: Announcement[] = [];

  constructor(private _http: HttpClient) {}

  fetchAnnouncements(): Observable<Announcement[]> {
    return this._http
      .get<Announcement[]>(
        environment.firebaseConfig.databaseURL + '/announcements.json'
      )
      .pipe(
        map((announcements) => {
          for (let key in announcements) {
            announcements[key].id = key;
          }
          return Object.values(announcements).reverse();
        }),
        tap((announcements) => {
          this._setAnnouncements(announcements);
        })
      );
  }

  fetchAnnouncementById(id: string): Observable<Announcement> {
    return this._http.get<Announcement>(
      `${environment.firebaseConfig.databaseURL}/announcements/${id}.json`
    );
  }

  storeAnnouncement(announcement: Announcement) {
    return this._http.post(
      environment.firebaseConfig.databaseURL + '/announcements.json',
      announcement
    );
  }

  getAnnouncements() {
    return this._announcements;
  }

  getAnnouncementById(id: string) {
    const announcement = this._announcements.find((a) => a.id === id)!;
    return announcement ? announcement : null;
  }

  private _setAnnouncements(announcements: Announcement[]) {
    this._announcements = announcements;
    this._announcementsChanged.next(this._announcements);
  }
}
