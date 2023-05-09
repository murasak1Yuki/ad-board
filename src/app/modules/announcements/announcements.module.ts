import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementsRoutingModule } from './announcements-routing.module';
import { AnnouncementItemModule } from '@shared/components/announcement-item/announcement-item.component';
import { RecommendedAnnouncementsComponent } from '@announcements-pages/recommended-announcements/recommended-announcements.component';
import { AnnouncementViewComponent } from './pages/announcement-view/announcement-view.component';
import { GalleryModule } from '@shared/components/gallery/gallery.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { RequestedAnnouncementsComponent } from './pages/requested-announcements/requested-announcements.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RecommendedAnnouncementsComponent,
    AnnouncementViewComponent,
    RequestedAnnouncementsComponent,
  ],
  imports: [
    AnnouncementsRoutingModule,
    CommonModule,
    AnnouncementItemModule,
    GalleryModule,
    BreadcrumbModule,
    SkeletonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
})
export class AnnouncementsModule {}
