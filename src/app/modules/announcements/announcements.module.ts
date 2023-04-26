import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AnnouncementsRoutingModule } from './announcements-routing.module';
import { AnnouncementItemModule } from '@shared/components/announcement-item/announcement-item.component';
import {
  RecommendedAnnouncementsComponent
} from '@announcements-pages/recommended-announcements/recommended-announcements.component';
import { AnnouncementViewComponent } from './pages/announcement-view/announcement-view.component';
import { GalleryModule } from "@shared/components/gallery/gallery.component";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { SkeletonModule } from "primeng/skeleton";

@NgModule({
  declarations: [RecommendedAnnouncementsComponent, AnnouncementViewComponent],
  imports: [
    AnnouncementsRoutingModule,
    ProgressSpinnerModule,
    CommonModule,
    AnnouncementItemModule,
    GalleryModule,
    BreadcrumbModule,
    SkeletonModule,
  ],
})
export class AnnouncementsModule {}
