import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Product } from '../../models/product.model';
import * as productSelector from '../../store/product.selectors';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductActionTypes } from '../../store/product.action-types';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  @Output() editClicked = new EventEmitter<Product>();

  private store = inject(Store);
  products$ = this.store.select(productSelector.selectProducts);
  loading$ = this.store.select(productSelector.selectLoading);
  error$ = this.store.select(productSelector.selectError);
  total$ = this.store.select(productSelector.selectProducts);
  ngOnInit() {
    this.store.dispatch(ProductActionTypes.loadProducts());
  }

  trackById(_: number, product: Product) {
    return product.id;
  }

  onEdit(product: Product) {
    this.store.dispatch(ProductActionTypes.selectProduct({ product }));
    this.editClicked.emit(product);
  }

  onDelete(product: Product) {
    if (confirm(`Delete "${product.title}"?`)) {
      this.store.dispatch(ProductActionTypes.deleteProduct({ id: product.id }));
    }
  }
}
