import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  RecommendedAnnouncementsComponent
} from '@announcements-pages/recommended-announcements/recommended-announcements.component';
import {
  AnnouncementViewComponent
} from '@announcements-pages/announcement-view/announcement-view.component';

const routes: Routes = [
  {
    path: '',
    component: RecommendedAnnouncementsComponent,
  },
  {
    path: 'view/:id',
    component: AnnouncementViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnouncementsRoutingModule {}
