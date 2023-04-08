import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecommendedAnnouncementsComponent } from './pages/recommended-announcements/recommended-announcements.component';

const routes: Routes = [
  { path: '', component: RecommendedAnnouncementsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnouncementsRoutingModule {}
