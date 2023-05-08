import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AnnouncementsService } from '@services/announcements.service';
import { CategoriesService } from '@services/categories.service';
import { Announcement } from '@models/announcement.model';
import { Category } from '@models/category.model';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-requested-announcements',
  templateUrl: './requested-announcements.component.html',
  styleUrls: ['./requested-announcements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestedAnnouncementsComponent implements OnInit {
  public announcements: Announcement[] = [];
  public skeletonArr = new Array(16);
  public isLoading: boolean = false;
  public countEnding!: string;
  public category!: Category;

  constructor(
    private _route: ActivatedRoute,
    private _announcementsService: AnnouncementsService,
    private _categoriesService: CategoriesService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._loadAnnouncementsByCategoryName();
  }

  private _getAnnouncementsEnding() {
    let lastDigit = this.announcements.length % 10; // Получение последней цифры числа
    if (lastDigit === 1) {
      this.countEnding = 'объявление';
    } else if (lastDigit > 1 && lastDigit < 5) {
      this.countEnding = 'объявления';
    } else {
      this.countEnding = 'объявлений';
    }
  }

  private _loadAnnouncementsByCategoryName() {
    this.isLoading = true;
    this._route.params
      .pipe(
        switchMap((params: Params) => {
          const announcements: Announcement[] = this._announcementsService.getAnnouncements();
          const categories: Category[] = this._categoriesService.getCategories();
          if (announcements.length !== 0 && categories.length !== 0) {
            const announcementsByCategory =
              this._getAnnouncementsByCategoryName(
                params,
                categories,
                announcements
              );
            return of(announcementsByCategory);
          } else {
            return forkJoin([
              this._categoriesService.fetchCategories(),
              this._announcementsService.fetchAnnouncements(),
            ]).pipe(
              switchMap(([categories, announcements]) => {
                return of(
                  this._getAnnouncementsByCategoryName(
                    params,
                    categories,
                    announcements
                  )
                );
              })
            );
          }
        })
      )
      .subscribe((announcements) => {
        this.announcements = announcements;
        this._getAnnouncementsEnding();
        this.isLoading = false;
        this._cdr.markForCheck();
      });
  }

  private _getAnnouncementsByCategoryName(
    params: Params,
    categories: Category[],
    announcements: Announcement[]
  ) {
    const categoryId = +params['id'];
    this.category = categories.find((c) => c.id === categoryId)!;
    return announcements.filter((a) =>
      a.categoryNames.includes(this.category.name)
    );
  }
}
