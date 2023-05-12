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
import { AuthService } from '@services/auth.service';
import { YaApiLoaderService } from 'angular8-yandex-maps';
import { UserInfoModel } from '@models/user-info.model';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAnnouncementComponent implements OnInit {
  public categoriesTree!: TreeNode[];
  public newAnnouncementForm!: FormGroup;
  public isImagesError: boolean = false;
  public error: string | null = null;
  public selectedImages = new Set<File>();
  private _categoriesData!: Category[];

  constructor(
    private _categoriesService: CategoriesService,
    private _imagesService: ImagesService,
    private _authService: AuthService,
    private _announcementService: AnnouncementsService,
    private _yaApiLoaderService: YaApiLoaderService,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {}

  onImageSelect(imagesToSelect: FileUpload) {
    for (let image of imagesToSelect.files) {
      if (!this.selectedImages.has(image)) {
        this.selectedImages.add(image);
      }
    }
    if (this.selectedImages.size != 0) {
      this.isImagesError = false;
    }
  }

  onImageRemove(imageToDelete: { file: File }) {
    this.selectedImages.delete(imageToDelete.file);
  }

  onSubmit() {
    if (this.selectedImages.size === 0) {
      this.isImagesError = true;
      return;
    }
    this._imagesService.uploadImages(this.selectedImages).subscribe({
      next: (imageUrls) => {
        const { category, name, phone, price, location, description } = this.newAnnouncementForm.value;
        const newAnnouncement: Announcement = {
          categoryNames: this._categoriesService.getCategoryNamesFromTreeNode(category),
          name: name,
          phone: phone,
          price: price.toString(),
          date: Date.now().toString(),
          location: location,
          desc: description,
          creatorId: this._authService.user.value?.id!,
          images: imageUrls,
        };
        if (
          !this._authService.user.value?.userInfo.phone &&
          !this._authService.user.value?.userInfo.location
        ) {
          const newUserInfo: UserInfoModel = {
            userId: this._authService.user.value?.id!,
            phone: phone,
            name: '',
            location: location,
          };
          this._authService.updateUserInfo(
            this._authService.user.value?.userInfo.userInfoId!,
            newUserInfo
          );
        }
        this._announcementService
          .storeAnnouncement(newAnnouncement)
          .subscribe(() => {
            this._router.navigateByUrl('');
          });
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this._cdr.markForCheck();
      },
    });
  }

  ngOnInit() {
    this._yaApiLoaderService.load().subscribe((ymaps) => {
      new ymaps.SuggestView('location');
    });
    this._categoriesService.fetchCategories().subscribe((categories) => {
      this._categoriesData = categories;
      this.categoriesTree = this._categoriesService.convertCategoriesToTree(
        this._categoriesData
      );
    });
    const userPhone = this._authService.user.value?.userInfo.phone!;
    const userLocation = this._authService.user.value?.userInfo.location!;
    this.newAnnouncementForm = new FormGroup({
      category: new FormControl<TreeNode | null>(null, Validators.required),
      name: new FormControl<string | null>(null, Validators.required),
      phone: new FormControl<string | null>(userPhone),
      description: new FormControl<string | null>(null),
      location: new FormControl<string | null>(userLocation, Validators.required),
      price: new FormControl<number>(0, Validators.min(0)),
    });
  }
}
