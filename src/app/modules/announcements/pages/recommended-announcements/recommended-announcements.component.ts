import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AnnouncementsService } from '@services/announcements.service';
import { Announcement } from '@models/announcement.model';

@Component({
  selector: 'app-recommended-announcements',
  templateUrl: './recommended-announcements.component.html',
  styleUrls: ['./recommended-announcements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedAnnouncementsComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  isLoading = false;
  skeletonArr = new Array(16);
  private _announcementsSub!: Subscription;

  constructor(
    private _announcementsService: AnnouncementsService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._loadAnnouncements();
  }

  ngOnDestroy() {
    this._announcementsSub.unsubscribe();
  }

  private _loadAnnouncements() {
    this.isLoading = true;
    this._announcementsService.fetchAnnouncements().subscribe(() => {
      this.isLoading = false;
    });
    this._announcementsSub =
      this._announcementsService.announcementsChanged$.subscribe(
        (announcements) => {
          this.announcements = announcements;
          this._cdr.markForCheck();
        }
      );
  }
}
