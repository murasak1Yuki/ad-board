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

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementItemComponent {
  @Input() announcement: Announcement | null = null;

  get price() {
    return this.announcement?.price!.replace(/\s/g, '');
  }
}

@NgModule({
  declarations: [AnnouncementItemComponent],
  imports: [CurrencyPipe, DatePipe, SkeletonModule, NgIf, RouterLink],
  exports: [AnnouncementItemComponent],
})
export class AnnouncementItemModule {}
