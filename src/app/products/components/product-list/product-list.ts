import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Product } from '../../models/product.model';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  @Output() editClicked = new EventEmitter<Product>();

  store = inject(ProductStore);
  ngOnInit() {
    this.store.loadProducts();
  }

  trackById(_: number, product: Product) {
    return product.id;
  }

  onEdit(product: Product) {
    this.store.selectProduct(product);
    this.editClicked.emit(product);
  }

  onDelete(product: Product) {
    if (confirm(`Delete "${product.title}"?`)) {
      this.store.deleteProduct(product.id);
    }
  }
}
