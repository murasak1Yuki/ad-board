import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss'],
})
export class CreateAnnouncementComponent implements OnInit {
  categories!: TreeNode[];
  newAnnouncementForm!: FormGroup;
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  categoriesData = [
    {
      categoryId: 1,
      id: 25984,
      name: 'Транспорт',
    },
    {
      categoryId: 9,
      id: 25985,
      name: 'Автомобили',
      parentId: 25984,
    },
    {
      categoryId: 14,
      id: 25986,
      name: 'Мотоциклы и мототехника',
      parentId: 25984,
    },
    {
      categoryId: 14,
      id: 25988,
      name: 'Вездеходы',
      parentId: 25986,
    },
    {
      categoryId: 14,
      id: 25989,
      name: 'Картинг',
      parentId: 25986,
    },
    {
      categoryId: 14,
      id: 25990,
      name: 'Квадроциклы и багги',
      parentId: 25986,
    },
    {
      categoryId: 14,
      id: 25991,
      name: 'Мопеды и скутеры',
      parentId: 25986,
    },
  ];

  convertCategoriesToTree(
    categories: {
      categoryId: number;
      id: number;
      name: string;
      parentId?: number;
    }[]
  ): TreeNode[] {
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

  selectFile(upload: FileUpload) {
    for (let file of upload.files) {
      this.newAnnouncementForm.patchValue({ images: file });
      this.newAnnouncementForm.get('images')!.updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.newAnnouncementForm = new FormGroup({
      category: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      location: new FormControl(null),
      images: new FormControl(null),
      price: new FormControl(0),
    });
    this.categories = this.convertCategoriesToTree(this.categoriesData);
  }
}
