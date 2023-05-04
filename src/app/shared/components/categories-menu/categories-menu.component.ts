import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
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
  public showItemsCounts: number[] = [];
  public selectedParentCategory!: Category;

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    if (this.categories && this.categories.length > 0) {
      this.parentCategories = this.categories.filter(
        (category) => !category.parentId
      );

      this.selectedParentCategory = this.parentCategories[0];
      this._fillShowItemsCounts();
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
    this._fillShowItemsCounts();
  }

  public getChildren(category: Category): Category[] {
    return this.categories?.filter((c) => c.parentId === category.id) ?? [];
  }

  private _fillShowItemsCounts() {
    const children = this.getChildren(this.selectedParentCategory);
    this.showItemsCounts = new Array(children.length).fill(3)
  }
}

@NgModule({
  declarations: [CategoriesMenuComponent],
  exports: [CategoriesMenuComponent],
  imports: [NgForOf, NgIf, NgClass],
})
export class CategoriesMenuModule {}
