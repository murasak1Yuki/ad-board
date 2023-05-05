import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  RecommendedAnnouncementsComponent
} from '@announcements-pages/recommended-announcements/recommended-announcements.component';
import {
  AnnouncementViewComponent
} from '@announcements-pages/announcement-view/announcement-view.component';
import {
  RequestedAnnouncementsComponent
} from "@announcements-pages/requested-announcements/requested-announcements.component";

const routes: Routes = [
  {
    path: '',
    component: RecommendedAnnouncementsComponent,
  },
  {
    path: 'view/:id',
    component: AnnouncementViewComponent,
  },
  {
    path: 'requested/:id',
    component: RequestedAnnouncementsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnouncementsRoutingModule {}
