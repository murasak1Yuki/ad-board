import { NgModule } from '@angular/core';
import { CreateAnnouncementComponent } from './create-announcement.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CreateAnnouncementComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: CreateAnnouncementComponent },
    ]),
  ],
})
export class CreateAnnouncementModule {}
