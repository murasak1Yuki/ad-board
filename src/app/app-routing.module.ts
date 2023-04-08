import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/recommended-announcements', pathMatch: 'full' },
  {
    path: 'recommended-announcements',
    loadChildren: () =>
      import('./modules/announcements/announcements.module').then(
        (m) => m.AnnouncementsModule
      ),
  },
  {
    path: 'create-announcement',
    loadChildren: () =>
      import('./modules/create-announcement/create-announcement.module').then(
        (m) => m.CreateAnnouncementModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
