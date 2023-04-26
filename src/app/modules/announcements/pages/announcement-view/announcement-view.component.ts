import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AnnouncementsService } from '@services/announcements.service';
import { Announcement } from '@models/announcement.model';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.scss'],
})
export class AnnouncementViewComponent implements OnInit {
  public announcement!: Announcement | null;
  public categoryItems!: MenuItem[];
  private _id!: string;

  constructor(
    private _route: ActivatedRoute,
    private _announcementsService: AnnouncementsService
  ) {}

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this._id = params['id'];
      const announcements = this._announcementsService.getAnnouncements();
      if (announcements.length !== 0) {
        this.announcement = this._announcementsService.getAnnouncementById(
          this._id
        );
        this._createMenuItemsFromCategories();
      } else {
        this._announcementsService
          .fetchAnnouncementById(this._id)
          .subscribe((announcement) => {
            this.announcement = { ...announcement, id: this._id };
            this._createMenuItemsFromCategories();
          });
      }
    });
  }

  private _createMenuItemsFromCategories() {
    this.categoryItems =
      this.announcement?.categoryNames.reverse().map((categoryName) => {
        return {
          label: categoryName,
        };
      }) || [];
  }
}
