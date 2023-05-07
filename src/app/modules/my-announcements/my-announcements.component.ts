import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AnnouncementsService } from '@services/announcements.service';
import { Announcement } from '@models/announcement.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-announcements',
  templateUrl: './my-announcements.component.html',
  styleUrls: ['./my-announcements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAnnouncementsComponent implements OnInit, OnDestroy {
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
    this._announcementsService.fetchAnnouncements(true).subscribe(() => {
      this.isLoading = false;
    });
    this._announcementsSub = this._announcementsService.announcementsChanged$.subscribe(
        (announcements) => {
          this.announcements = announcements;
          this._cdr.markForCheck();
        }
      );
  }
}
