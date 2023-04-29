import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyAnnouncementsComponent } from './my-announcements.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AnnouncementItemModule } from '@shared/components/announcement-item/announcement-item.component';
import { NgForOf, NgIf } from '@angular/common';

@NgModule({
  declarations: [MyAnnouncementsComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MyAnnouncementsComponent,
        canActivate: [AuthGuard],
      },
    ]),
    AnnouncementItemModule,
    NgForOf,
    NgIf,
  ],
})
export class MyAnnouncementsModule {}
