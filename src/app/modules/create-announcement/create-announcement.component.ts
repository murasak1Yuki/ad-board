import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { CategoriesService } from '@services/categories.service';
import { Category } from '@models/category.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Announcement } from '@models/announcement.model';
import { AnnouncementsService } from '@services/announcements.service';
import { Router } from '@angular/router';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAnnouncementComponent implements OnInit {
  categoriesTree!: TreeNode[];
  newAnnouncementForm!: FormGroup;
  selectedImages: File[] = [];
  imagesError: boolean = false;
  imageUrls: string[] = [];
  newAnnouncement!: Announcement;
  private _categoriesData!: Category[];

  constructor(
    private _categoriesService: CategoriesService,
    private _storage: AngularFireStorage,
    private _announcementService: AnnouncementsService,
    private _router: Router
  ) {}

  onImageSelect(selectedImages: FileUpload) {
    for (let image of selectedImages.files) {
      let isFileAlreadyUploaded = this.selectedImages.some(
        (uploadedImage) =>
          uploadedImage.name === image.name &&
          uploadedImage.type === image.type &&
          uploadedImage.size === image.size
      );
      if (!isFileAlreadyUploaded) {
        this.selectedImages.push(image);
      }
    }
  }

  onImageRemove(imageToDelete: {file: File}) {
    let index = this.selectedImages.indexOf(imageToDelete.file);
    if (index >= 0) {
      this.selectedImages.splice(index, 1);
    }
    console.log(this.selectedImages)
  }

  onSubmit() {
    if (!this.selectedImages.length) {
      this.imagesError = true;
      return;
    }
    this.uploadImages().then(() => {
      this.newAnnouncement = {
        categoryNames: this._categoriesService.getCategoryNamesFromTreeNode(
          this.newAnnouncementForm.get('category')?.value
        ),
        name: this.newAnnouncementForm.get('name')?.value,
        phone: this.newAnnouncementForm.get('phone')?.value,
        price: this.newAnnouncementForm.get('price')?.value.toString(),
        date: Date.now().toString(),
        location: this.newAnnouncementForm.get('location')?.value,
        desc: this.newAnnouncementForm.get('description')?.value,
        images: this.imageUrls,
        id: Math.random().toString(36).substring(2),
      };
      this._announcementService.storeAnnouncement(this.newAnnouncement);
    });
    this._router.navigate(['']);
  }

  async uploadImages() {
    for (let image of this.selectedImages) {
      const filePath = `images/${new Date().getTime()}_${image.name}`;
      const storage = getStorage();
      const fileRef = ref(storage, filePath);
      await this._storage.upload(filePath, image);
      getDownloadURL(fileRef).then((url) => {
        this.imageUrls.push(url);
      });
    }
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
