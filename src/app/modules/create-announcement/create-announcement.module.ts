import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateAnnouncementComponent } from './create-announcement.component';

@NgModule({
  declarations: [CreateAnnouncementComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: CreateAnnouncementComponent },
    ]),
  ],
})
export class CreateAnnouncementModule {}
