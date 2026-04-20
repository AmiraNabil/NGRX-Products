import { createAction, props } from '@ngrx/store';
import { CreateProduct, Product } from '../models/product.model';

// Load Products Actions
export const loadProducts = createAction('[Products] Load Products');
export const loadProductSuccess = createAction(
  '[Products] Load Product Success',
  props<{ products: Product[] }>(),
);

export const loadProductFailure = createAction(
  '[Products] Load Product Failure',
  props<{ error: string }>(),
);

// Create Products Actions
export const createProduct = createAction(
  '[Products] Create Product',
  props<{ payload: CreateProduct }>(),
);

export const createProductSuccess = createAction(
  '[Products] Create Product Success',
  props<{ product: Product }>(),
);

export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: string }>(),
);

// Update Products Actions
export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ id: number; payload: Partial<CreateProduct> }>(),
);

export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>(),
);

export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: string }>(),
);

// Delete Products Actions
export const deleteProduct = createAction('[Products] Delete Product', props<{ id: number }>());
export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{ id: number }>(),
);
export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{ error: string }>(),
);

export const selectProduct = createAction(
  '[Products] Select Product',
  props<{ product: Product }>(),
);
export const clearProduct = createAction('[Products] Clear Product');
export const clearError = createAction('[Products] Clear Error');
