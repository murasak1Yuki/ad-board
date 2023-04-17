import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '@models/category.model';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private _http: HttpClient) {}

  fetchCategories() {
    return this._http.get<Category[]>(
      environment.firebaseConfig.databaseURL + '/categories.json'
    );
  }

  convertCategoriesToTree(categories: Category[]): TreeNode[] {
    const categoryMap = new Map<number, TreeNode>();
    const rootCategories: TreeNode[] = [];

    categories.forEach((category) => {
      const treeNode = { label: category.name, children: [] };
      categoryMap.set(category.id, treeNode);

      if (!category.parentId) {
        rootCategories.push(treeNode);
      } else {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children!.push(treeNode);
        }
      }
    });

    return rootCategories;
  }

  getCategoryNamesFromTreeNode(node: TreeNode): string[] {
    if (!node) return [];
    const categoryNames = [node.label as string];
    if (node.parent) {
      categoryNames.push(...this.getCategoryNamesFromTreeNode(node.parent));
    }
    return categoryNames;
  }
}
