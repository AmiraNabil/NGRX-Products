import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductStore } from '../../store/product.store';
import { ProductListComponent } from '../product-list/product-list';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductListComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  view: 'list' | 'form' = 'list';

  private store = inject(ProductStore);

  showForm() {
    this.store.clearProduct();
    this.view = 'form';
  }

  onEditClicked(product: Product) {
    this.store.selectProduct(product);
    this.view = 'form';
  }

  onFormDone() {
    this.view = 'list';
  }
}
