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
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementViewComponent implements OnInit {
  public announcement!: Announcement;
  public categoryItems!: MenuItem[];
  public isLoading: boolean = false;
  public skeletonArr = new Array(3);
  private _username!: string;

  constructor(
    private _route: ActivatedRoute,
    private _dialogService: DialogService,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private _announcementsService: AnnouncementsService
  ) {}

  ngOnInit() {
    this._loadAnnouncement();
  }

  onOpenOnTheMap() {
    const locationString = this.announcement?.location;
    const url = `https://yandex.com/maps/?text=${encodeURIComponent(locationString!)}`;
    window.open(url, '_blank');
  }

  public showPhoneDialog() {
    this._dialogService.open(PhoneModalComponent, {
      dismissableMask: true,
      header: this._username ? this._username : 'Имя не указано.',
      width: '100%',
      style: {
        'max-width': '520px',
      },
      data: {
        phone: this.announcement?.phone ?? 'Номер телефона не указан.',
      },
    });
  }

  private _loadAnnouncement() {
    this.isLoading = true;
    this._route.params
      .pipe(
        switchMap((params: Params) => {
          const announcements = this._announcementsService.getAnnouncements();
          if (announcements.length !== 0) {
            return of(this._announcementsService.getAnnouncementById(params['id']));
          } else {
            return this._announcementsService.fetchAnnouncementById(params['id']);
          }
        }),
        tap((announcement) => {
          this.announcement = announcement;
          this._createMenuItemsFromCategories();
          this._cdr.markForCheck();

          this._authService.getUsersInfo().subscribe(usersInfo => {
            this._username = usersInfo.find(userInfo => {
              return userInfo.userId === announcement.creatorId;
            })?.name!;
          })
        }),
      )
      .subscribe(() => {
        this.isLoading = false;
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
