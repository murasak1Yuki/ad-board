import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../data/services/products.service';
import { Product } from '../../data/models/product.model';

@Component({
  selector: 'app-announcement-home',
  templateUrl: './announcement-home.component.html',
  styleUrls: ['./announcement-home.component.scss'],
})
export class AnnouncementHomeComponent implements OnInit {
  products!: Product[];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.products = this.productsService.getProducts();
  }
}
