import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-announcement-heading',
  templateUrl: './announcement-heading.component.html',
  styleUrls: ['./announcement-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementHeadingComponent {}

@NgModule({
  declarations: [AnnouncementHeadingComponent],
  imports: [ButtonModule, RouterLink],
  exports: [AnnouncementHeadingComponent],
})
export class AnnouncementHeadingModule {}
