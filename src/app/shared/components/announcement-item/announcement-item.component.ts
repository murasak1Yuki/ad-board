import { Component, Input, NgModule } from '@angular/core';
import { Announcement } from '../../announcement.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.scss'],
})
export class AnnouncementItemComponent {
  @Input() announcement!: Announcement;

  get price() {
    return this.announcement.price.replace(/\s/g, '');
  }
}

@NgModule({
  declarations: [AnnouncementItemComponent],
  imports: [CurrencyPipe, DatePipe],
  exports: [AnnouncementItemComponent],
})
export class AnnouncementItemModule {}
