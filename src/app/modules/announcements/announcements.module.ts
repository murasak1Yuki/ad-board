import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AnnouncementsRoutingModule } from './announcements-routing.module';
import { RecommendedAnnouncementsComponent } from './pages/recommended-announcements/recommended-announcements.component';
import { AnnouncementItemModule } from '../../shared/components/announcement-item/announcement-item.component';

@NgModule({
  declarations: [RecommendedAnnouncementsComponent],
  imports: [
    AnnouncementsRoutingModule,
    ProgressSpinnerModule,
    CommonModule,
    AnnouncementItemModule,
  ],
})
export class AnnouncementsModule {}
