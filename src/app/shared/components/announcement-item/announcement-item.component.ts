import { Component, Input } from '@angular/core';
import { Product } from '@data/models/product.model';

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.scss'],
})
export class AnnouncementItemComponent {
  @Input() product!: Product;
}
