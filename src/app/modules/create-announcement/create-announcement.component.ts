import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  private _selectedImages = new Set<File>();
  private _categoriesData!: Category[];

  constructor(
    private _categoriesService: CategoriesService,
    private _imagesService: ImagesService,
    private _announcementService: AnnouncementsService,
    private _router: Router
  ) {}

  onImageSelect(imagesToSelect: FileUpload) {
    for (let image of imagesToSelect.files) {
      if (!this._selectedImages.has(image)) {
        this._selectedImages.add(image);
      }
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
    this._imagesService
      .uploadImages(this._selectedImages)
      .subscribe((imageUrls) => {
        const { category, name, phone, price, location, description } = this.newAnnouncementForm.value;
        const newAnnouncement: Announcement = {
          categoryNames: this._categoriesService.getCategoryNamesFromTreeNode(category),
          name: name,
          phone: phone,
          price: price.toString(),
          date: Date.now().toString(),
          location: location,
          desc: description,
          images: imageUrls,
          id: Math.random().toString(36).substring(2),
        };
        this._announcementService.storeAnnouncement(newAnnouncement);
      });
    this._router.navigate(['']);
  }

  isControlInvalidAndTouched(
    controlName: string,
    errorMessage: string
  ): boolean {
    return (
      this.newAnnouncementForm.get(controlName)?.errors?.[errorMessage] &&
      this.newAnnouncementForm.get(controlName)?.touched
    );
  }

  ngOnInit() {
    this._categoriesService.fetchCategories().subscribe((categories) => {
      this._categoriesData = categories;
      this.categoriesTree = this._categoriesService.convertCategoriesToTree(
        this._categoriesData
      );
    });
    this.newAnnouncementForm = new FormGroup({
      category: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      description: new FormControl(null),
      location: new FormControl(null, Validators.required),
      price: new FormControl(0, Validators.min(0)),
    });
  }
}
