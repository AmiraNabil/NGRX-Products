import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { CreateProduct, Product } from '../models/product.model';
import { ProductService } from '../services/product';
import {
  addEntity,
  setAllEntities,
  updateEntity,
  withEntities,
  removeEntity,
} from '@ngrx/signals/entities';

interface ProductState {
  selectedId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  selectedId: null,
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },

  withDevtools('products'),

  withEntities<Product>(),
  withState(initialState),
  withComputed((store) => ({
    hasProduct: computed(() => store.ids().length > 0),
    totalProducts: computed(() => store.ids().length),
    allProducts: computed(() => store.ids().map((id) => store.entityMap()[id])),
    selected: computed(() => {
      const id = store.selectedId();
      return id !== null ? (store.entityMap()[id] ?? null) : null;
    }),
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
              updateState(store, '[Products] Load Success', setAllEntities(products), {
                loading: false,
              }),
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
              updateState(store, '[Products] Create Success', addEntity(product), {
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
              updateState(
                store,
                '[Products] Update Success',
                updateEntity({ id: updated.id, changes: updated }),
                {
                  loading: false,
                  selectedId: updated.id,
                },
              ),
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
              updateState(store, '[Products] Delete Success', removeEntity(id), { loading: false }),
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
      updateState(store, '[Products] Select Product', { selectedId: product.id });
    },

    clearProduct() {
      updateState(store, '[Products] Clear Product', { selectedId: null });
    },

    clearError() {
      updateState(store, '[Products] Clear Error', { error: null });
    },
  })),
);
