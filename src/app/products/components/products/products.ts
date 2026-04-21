import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductListComponent } from '../product-list/product-list';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private router = inject(Router);
  store = inject(ProductStore);

  goToAdd() {
    this.store.clearProduct();
    this.router.navigate(['/products/add']);
  }

  onEditClicked(product: Product) {
    this.store.selectProduct(product);
    this.router.navigate(['/products/edit', product.id]);
  }
}
