import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

import { Announcement } from '@models/announcement.model';
import { RouterLink } from '@angular/router';
import { DatetimeModule } from '@shared/pipes/datetime.pipe';

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementItemComponent {
  @Input() announcement: Announcement | null = null;
}

@NgModule({
  declarations: [AnnouncementItemComponent],
  imports: [
    CurrencyPipe,
    DatePipe,
    SkeletonModule,
    NgIf,
    RouterLink,
    DatetimeModule,
  ],
  exports: [AnnouncementItemComponent],
})
export class AnnouncementItemModule {}
