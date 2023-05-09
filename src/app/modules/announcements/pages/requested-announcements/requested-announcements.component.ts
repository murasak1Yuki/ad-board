import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { AnnouncementsService } from '@services/announcements.service';
import { CategoriesService } from '@services/categories.service';
import { Announcement } from '@models/announcement.model';
import { Category } from '@models/category.model';
import { forkJoin, of, switchMap } from 'rxjs';
import { SelectItem } from 'primeng/api';

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

  public selectedSortOption: string = 'new';
  public sortOptions!: SelectItem[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _announcementsService: AnnouncementsService,
    private _categoriesService: CategoriesService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sortOptions = [
      { label: 'По новизне', value: 'new' },
      { label: 'По возрастанию цены', value: 'priceAsc' },
      { label: 'По убыванию цены', value: 'priceDesc' },
    ];
    this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.selectedSortOption = 'new';
      }
    });
    this._loadAnnouncementsByCategoryName();
  }

  public sortAnnouncements(value: string) {
    this.selectedSortOption = value;

    switch (this.selectedSortOption) {
      case 'new':
        // Сортировка по дате
        this.announcements = this.announcements.sort(
          (a, b) => +b.date - +a.date
        );
        break;
      case 'priceAsc':
        // Сортировка по возрастанию цены
        this.announcements = this.announcements.sort((a, b) => {
          return +a.price! - +b.price!;
        });
        break;
      case 'priceDesc':
        // Сортировка по убыванию цены
        this.announcements = this.announcements.sort((a, b) => {
          return +b.price! - +a.price!;
        });
        break;
    }
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
          const announcements: Announcement[] =
            this._announcementsService.getAnnouncements();
          const categories: Category[] =
            this._categoriesService.getCategories();
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
