import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { CreateProduct, Product } from '../models/product.model';
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
    // Load product
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

    // Create product
    createProduct: rxMethod<CreateProduct>(
      pipe(
        tap(() => updateState(store, '[Products] Create Start', { loading: true, error: null })),
        switchMap((data) =>
          productService.create(data).pipe(
            tap((product: Product) =>
              updateState(store, '[Products] Create Success', {
                products: [product, ...store.products()],
                loading: false,
              }),
            ),
            catchError((err) => {
              updateState(store, '[Products] Create Failure', {
                loading: false,
                error: err.message,
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    // Update product
    updateProduct: rxMethod<{ id: number; data: Partial<CreateProduct> }>(
      pipe(
        tap(() => updateState(store, '[Products] Update Start', { loading: true, error: null })),
        switchMap(({ id, data }) =>
          productService.update(id, data).pipe(
            tap((updated: Product) =>
              updateState(store, '[Products] Update Success', {
                products: store.products().map((p) => (p.id === updated.id ? updated : p)),
                loading: false,
                selected: updated,
              }),
            ),
            catchError((err) => {
              updateState(store, '[Products] Update Failure', {
                loading: false,
                error: err.message,
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    // Delete product
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
