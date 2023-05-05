import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Category } from '@models/category.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-menu',
  templateUrl: './categories-menu.component.html',
  styleUrls: ['./categories-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesMenuComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] | null = null;
  @Output() close = new EventEmitter<void>();
  public parentCategories!: Category[];
  public selectedParentCategory!: Category;
  public selectedParentChildren: Category[] = [];
  public childCategoryChildren: Category[][] = [];
  public maxItemsToShow: number[] = [];

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    if (this.categories && this.categories.length > 0) {
      this.parentCategories = this.categories.filter(
        (category) => !category.parentId
      );

      this.selectedParentCategory = this.parentCategories[0];
      this._updateChildCategories();
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  public onClose() {
    this.close.emit();
  }

  public onHoverCategory(parentCategory: Category) {
    this.selectedParentCategory = parentCategory;
    this._updateChildCategories();
  }

  public showAllChildCategories(index: number) {
    this.maxItemsToShow[index] = this.childCategoryChildren[index].length;
  }

  private _updateChildCategories() {
    this.selectedParentChildren = this._getChildren(
      this.selectedParentCategory
    );
    this.childCategoryChildren = this.selectedParentChildren.map(
      (childCategory) => this._getChildren(childCategory)
    );
    this.maxItemsToShow = new Array(this.selectedParentChildren.length).fill(3);
  }

  private _getChildren(category: Category): Category[] {
    return this.categories?.filter((c) => c.parentId === category.id) ?? [];
  }
}

@NgModule({
  declarations: [CategoriesMenuComponent],
  exports: [CategoriesMenuComponent],
  imports: [NgForOf, NgIf, NgClass, RouterLink],
})
export class CategoriesMenuModule {}
