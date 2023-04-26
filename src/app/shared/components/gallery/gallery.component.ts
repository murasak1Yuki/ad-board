import { Component, Input, NgModule } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  @Input() announcementImages!: string[];
  @Input() announcementName!: string;
  currentIndex: number = 0;
}

@NgModule({
  declarations: [GalleryComponent],
  imports: [NgForOf],
  exports: [GalleryComponent],
})
export class GalleryModule {}
