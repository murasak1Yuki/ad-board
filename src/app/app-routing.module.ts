import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'my-announcements',
    loadChildren: () =>
      import('./modules/my-announcements/my-announcements.module').then(
        (m) => m.MyAnnouncementsModule
      ),
  },
  {
    path: 'create-announcement',
    loadChildren: () =>
      import('./modules/create-announcement/create-announcement.module').then(
        (m) => m.CreateAnnouncementModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/announcements/announcements.module').then(
        (m) => m.AnnouncementsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
