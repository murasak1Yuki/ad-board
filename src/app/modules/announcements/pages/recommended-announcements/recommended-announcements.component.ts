import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnnouncementsService } from '../../../../shared/announcements.service';
import { Announcement } from '../../../../shared/announcement.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recommended-announcements',
  templateUrl: './recommended-announcements.component.html',
  styleUrls: ['./recommended-announcements.component.scss'],
})
export class RecommendedAnnouncementsComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  isLoading = false;
  announcementsSub!: Subscription;

  constructor(private readonly _productsService: AnnouncementsService) {}

  ngOnInit() {
    this.loadAnnouncements();
  }

  ngOnDestroy() {
    this.announcementsSub.unsubscribe();
  }

  loadAnnouncements() {
    this.isLoading = true;
    this._productsService.fetchAnnouncements().subscribe(() => {
      this.isLoading = false;
    });
    this.announcementsSub =
      this._productsService.announcementsChanged.subscribe((announcements) => {
        this.announcements = announcements;
      });
    this.announcements = this._productsService.getAnnouncements();
  }
}
