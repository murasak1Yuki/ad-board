import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { CategoriesService } from '@services/categories.service';
import { Category } from '@models/category.model';
import { Announcement } from '@models/announcement.model';
import { AnnouncementsService } from '@services/announcements.service';
import { Router } from '@angular/router';
import { ImagesService } from '@services/images.service';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAnnouncementComponent implements OnInit {
  categoriesTree!: TreeNode[];
  newAnnouncementForm!: FormGroup;
  imagesError: boolean = false;
  error: string | null = null;
  private _selectedImages = new Set<File>();
  private _categoriesData!: Category[];

  constructor(
    private _categoriesService: CategoriesService,
    private _imagesService: ImagesService,
    private _announcementService: AnnouncementsService,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {}

  onImageSelect(imagesToSelect: FileUpload) {
    for (let image of imagesToSelect.files) {
      if (!this._selectedImages.has(image)) {
        this._selectedImages.add(image);
      }
    }
    if (this._selectedImages.size != 0) {
      this.imagesError = false;
    }
  }

  onImageRemove(imageToDelete: { file: File }) {
    this._selectedImages.delete(imageToDelete.file);
  }

  onSubmit() {
    if (this._selectedImages.size === 0) {
      this.imagesError = true;
      return;
    }
    this._imagesService.uploadImages(this._selectedImages).subscribe({
      next: (imageUrls) => {
        const { category, name, phone, price, location, description } =
          this.newAnnouncementForm.value;
        const newAnnouncement: Announcement = {
          categoryNames:
            this._categoriesService.getCategoryNamesFromTreeNode(category),
          name: name,
          phone: phone,
          price: price.toString(),
          date: Date.now().toString(),
          location: location,
          desc: description,
          images: imageUrls,
          id: Math.random().toString(36).substring(2),
        };
        this._announcementService.storeAnnouncement(newAnnouncement)
          .subscribe(() => {
            this._router.navigateByUrl('/recommended-announcements');
          });
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this._cdr.markForCheck();
      },
    });
  }

  ngOnInit() {
    this._categoriesService.fetchCategories().subscribe((categories) => {
      this._categoriesData = categories;
      this.categoriesTree = this._categoriesService.convertCategoriesToTree(
        this._categoriesData
      );
    });
    this.newAnnouncementForm = new FormGroup({
      category: new FormControl<TreeNode | null>(null, Validators.required),
      name: new FormControl<string | null>(null, Validators.required),
      phone: new FormControl<string | null>(null),
      description: new FormControl<string | null>(null),
      location: new FormControl<string | null>(null, Validators.required),
      price: new FormControl<number>(0, Validators.min(0)),
    });
  }
}
