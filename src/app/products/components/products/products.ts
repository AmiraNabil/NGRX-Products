import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductListComponent } from '../product-list/product-list';
import { ProductStore } from '../../store/product.store';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private router = inject(Router);
  store = inject(ProductStore);
  authStore = inject(AuthStore);

  ngOnInit(): void {
    this.authStore.loadProfile();
  }

  goToAdd() {
    this.store.clearProduct();
    this.router.navigate(['/products/add']);
  }

  onEditClicked(product: Product) {
    this.store.selectProduct(product);
    this.router.navigate(['/products/edit', product.id]);
  }

  logout() {
    this.authStore.logout();
  }
}
