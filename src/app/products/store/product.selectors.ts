import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

const selectState = createFeatureSelector<ProductState>('products');

export const selectProducts = createSelector(selectState, (state) => state.products);
export const selectHasProducts = createSelector(selectState, (state) => state.products.length > 0);
export const selectSelected = createSelector(selectState, (state) => state.selected);
export const selectLoading = createSelector(selectState, (state) => state.loading);
export const selectError = createSelector(selectState, (state) => state.error);
