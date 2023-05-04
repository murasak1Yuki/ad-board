import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import { CategoriesMenuModule } from '../categories-menu/categories-menu.component';
import { CategoriesService } from '@services/categories.service';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-announcement-heading',
  templateUrl: './announcement-heading.component.html',
  styleUrls: ['./announcement-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementHeadingComponent implements OnInit {
  public isOpen: boolean = false;
  public categories: Category[] = [];

  constructor(private _categoriesService: CategoriesService) {}

  ngOnInit() {
    this._categoriesService.fetchCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  public toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}

@NgModule({
  declarations: [AnnouncementHeadingComponent],
  imports: [ButtonModule, RouterLink, NgIf, CategoriesMenuModule, NgClass],
  exports: [AnnouncementHeadingComponent],
})
export class AnnouncementHeadingModule {}
