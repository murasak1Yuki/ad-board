import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';

import { Announcement } from '@models/announcement.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  private _announcementsChanged: Subject<Announcement[]> = new Subject<Announcement[]>();
  public announcementsChanged$: Observable<Announcement[]> = this._announcementsChanged.asObservable();
  private _announcements: Announcement[] = [];

  constructor(private _http: HttpClient, private _authService: AuthService) {}

  fetchAnnouncements(
    filterByUser: boolean = false
  ): Observable<Announcement[]> {
    const userId = this._authService.user.value?.id;
    const filterString = filterByUser
      ? `orderBy="creatorId"&equalTo="${userId}"`
      : '';
    return this._http
      .get<Record<string, Announcement>>(
        environment.firebaseConfig.databaseURL +
          `/announcements.json?${filterString}`
      )
      .pipe(
        map(announcements => {
          const announcementsArray = Object.entries(announcements).map(
            ([id, announcement]) => {
              announcement.id = id;
              return announcement;
            }
          );
          return filterByUser
            ? announcementsArray.sort((a, b) => +b.date - +a.date)
            : announcementsArray.reverse();
        }),
        tap((announcements) => {
          this._setAnnouncements(announcements);
        })
      );
  }

  fetchAnnouncementById(id: string) {
    return this._http
      .get<Announcement>(
        `${environment.firebaseConfig.databaseURL}/announcements/${id}.json`
      )
      .pipe(
        map((announcement) => {
          return { ...announcement, id: id };
        })
      );
  }

  storeAnnouncement(announcement: Announcement) {
    return this._http.post<{ [announcementId: string]: string }>(
      environment.firebaseConfig.databaseURL + '/announcements.json',
      announcement
    );
  }

  getAnnouncements() {
    return this._announcements;
  }

  getAnnouncementById(id: string) {
    return this._announcements.find((a) => a.id === id)!;
  }

  private _setAnnouncements(announcements: Announcement[]) {
    this._announcements = announcements;
    this._announcementsChanged.next(this._announcements);
  }
}
