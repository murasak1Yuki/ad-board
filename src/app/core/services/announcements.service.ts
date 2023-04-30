import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

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
  ): Observable<Record<string, Announcement>> {
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
        tap((announcements) => {
          const announcementsArray = Object.entries(announcements).map(
            ([id, announcement]) => {
              announcement.id = id;
              return announcement;
            }
          );
          const announcementsToSet = filterByUser
            ? announcementsArray.sort((a, b) => +b.date - +a.date)
            : announcementsArray.reverse();

          this._setAnnouncements(announcementsToSet);
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
