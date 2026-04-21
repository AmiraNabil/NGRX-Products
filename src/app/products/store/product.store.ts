import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product';

interface ProductState {
  products: Product[];
  selected: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selected: null,
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },

  withDevtools('products'),

  withState(initialState),

  withComputed((store) => ({
    hasProduct: computed(() => store.products().length > 0),
    totalProducts: computed(() => store.products().length),
  })),

  withMethods((store, productService = inject(ProductService)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        switchMap(() => {
          if (store.hasProduct()) return EMPTY;
          updateState(store, '[Products] Load Start', { loading: true, error: null });
          return productService.getAll().pipe(
            tap((products: Product[]) =>
              updateState(store, '[Products] Load Success', { products, loading: false }),
            ),
            catchError((err) => {
              updateState(store, '[Products] Load Failure', {
                loading: false,
                error: err.message,
              });
              return EMPTY;
            }),
          );
        }),
      ),
    ),

    deleteProduct: rxMethod<number>(
      pipe(
        tap(() => updateState(store, '[Products] Delete Start', { loading: true })),
        switchMap((id) =>
          productService.delete(id).pipe(
            tap(() =>
              updateState(store, '[Products] Delete Success', {
                products: store.products().filter((p) => p.id !== id),
                loading: false,
              }),
            ),
            catchError((err) => {
              updateState(store, '[Products] Delete Failure', {
                loading: false,
                error: err.message,
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    selectProduct(product: Product) {
      updateState(store, '[Products] Select Product', { selected: product });
    },

    clearProduct() {
      updateState(store, '[Products] Clear Product', { selected: null });
    },

    clearError() {
      updateState(store, '[Products] Clear Error', { error: null });
    },
  })),
);
