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
import { map, of, switchMap, tap } from 'rxjs';

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
  private _categoryMode: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _announcementsService: AnnouncementsService,
    private _categoriesService: CategoriesService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this._route.params.subscribe((params) => {
    //   const categoryId: number = +params['id'];
    //   this._categoryMode = params['id'] !== null;
    //   const categories = this._categoriesService.getCategories();
    //   const category = categories.find((c) => c.id === categoryId)!;
    //   this.announcements = this._announcementsService
    //     .getAnnouncements()
    //     .filter((a) => a.categoryNames.includes(category.name));
    //   this.isLoading = false;
    //   this._cdr.markForCheck();
    // });
    this._loadAnnouncementsByCategoryName();
  }

  private _loadAnnouncementsByCategoryName() {
    this.isLoading = true;
    this._route.params
      .pipe(
        switchMap((params: Params) => {
          let announcements: Announcement[] =
            this._announcementsService.getAnnouncements();
          let categories: Category[] = this._categoriesService.getCategories();
          if (announcements.length !== 0 && categories.length !== 0) {
            const categoryId: number = +params['id'];
            const category = categories.find((c) => c.id === categoryId)!;
            const announcementsByCategory = announcements.filter((a) =>
              a.categoryNames.includes(category.name)
            );
            return of(announcementsByCategory);
          } else {
            return this._categoriesService.fetchCategories().pipe(
              switchMap((categories) => {
                return this._announcementsService.fetchAnnouncements().pipe(
                  map((announcements) => {
                    const categoryId: number = +params['id'];
                    const category: Category = categories.find(
                      (c) => c.id === categoryId
                    )!;
                    return announcements.filter((a) =>
                      a.categoryNames.includes(category.name)
                    );
                  })
                );
              })
            );
          }
        }),
        tap((announcements) => {
          this.announcements = announcements;
          this._cdr.markForCheck();
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}
