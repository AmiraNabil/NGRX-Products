import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { ProductListComponent } from '../product-list/product-list';
import { CommonModule } from '@angular/common';
import { ProductActionTypes } from '../../store/product.action-types';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductListComponent, ProductListComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  view: 'list' | 'form' = 'list';

  constructor(private store: Store) {}

  showForm() {
    this.view = 'form';
  }

  onEditClicked(product: Product) {
    this.store.dispatch(ProductActionTypes.selectProduct({ product }));
    this.view = 'form';
  }

  onFormDone() {
    this.view = 'list';
  }
}
