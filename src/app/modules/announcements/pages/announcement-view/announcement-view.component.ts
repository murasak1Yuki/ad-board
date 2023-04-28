import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AnnouncementsService } from '@services/announcements.service';
import { Announcement } from '@models/announcement.model';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PhoneModalComponent } from '@shared/components/phone-modal/phone-modal.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementViewComponent implements OnInit {
  public announcement!: Announcement | null;
  public categoryItems!: MenuItem[];
  public isLoading: boolean = false;
  public skeletonArr = new Array(3);
  private _id!: string;

  constructor(
    private _route: ActivatedRoute,
    private _dialogService: DialogService,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private _announcementsService: AnnouncementsService
  ) {}

  ngOnInit() {
    this._announcementInit();
  }

  onOpenOnTheMap() {
    const locationString = this.announcement?.location;
    const url = `https://yandex.com/maps/?text=${encodeURIComponent(locationString!)}`;
    window.open(url, "_blank");
  }

  public showPhoneDialog() {
    const userEmail = this._authService.user.value?.email;
    this._dialogService.open(PhoneModalComponent, {
      dismissableMask: true,
      header: userEmail,
      width: '100%',
      style: {
        'max-width': '520px',
      },
      data: {
        phone: this.announcement?.phone,
      },
    });
  }

  private _announcementInit() {
    this.isLoading = true;
    this._route.params.subscribe((params: Params) => {
      this._id = params['id'];
      const announcements = this._announcementsService.getAnnouncements();
      if (announcements.length !== 0) {
        this.announcement = this._announcementsService.getAnnouncementById(
          this._id
        );
        this._createMenuItemsFromCategories();
        this.isLoading = false;
      } else {
        this._announcementsService
          .fetchAnnouncementById(this._id)
          .subscribe((announcement) => {
            this.announcement = { ...announcement, id: this._id };
            this._createMenuItemsFromCategories();
            this.isLoading = false;
            this._cdr.markForCheck();
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
