import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-categories-menu',
  templateUrl: './categories-menu.component.html',
  styleUrls: ['./categories-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesMenuComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] | null = null;
  public parentCategories!: Category[];
  public showItemsCounts: { [key: number]: number }[] = [];
  public selectedParentCategory!: Category;

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    if (this.categories && this.categories.length > 0) {
      this.parentCategories = this.categories.filter(
        (category) => !category.parentId
      );

      this.selectedParentCategory = this.parentCategories[0];
      this._initShowItemsCounts();
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  public onHoverCategory(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const selectedCategoryName = target.innerText.trim();

    this.selectedParentCategory = this.categories!.find(
      (category) => category.name === selectedCategoryName && !category.parentId
    )!;
    this.showItemsCounts = [];
    this._initShowItemsCounts();
  }

  public getChildren(category: Category): Category[] {
    return this.categories?.filter((c) => c.parentId === category.id) ?? [];
  }

  private _initShowItemsCounts() {
    const children = this.getChildren(this.selectedParentCategory);
    for (let i = 0; i < children.length; i++) {
      this.showItemsCounts.push({ [children[i].id]: 5 });
    }
  }
}

@NgModule({
  declarations: [CategoriesMenuComponent],
  exports: [CategoriesMenuComponent],
  imports: [NgForOf, NgIf],
})
export class CategoriesMenuModule {}
