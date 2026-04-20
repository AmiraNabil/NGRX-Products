import { createReducer, on } from '@ngrx/store';
import { Product } from '../models/product.model';
import { ProductActionTypes } from './product.action-types';

export interface ProductState {
  products: Product[];
  selected: Product | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
  products: [],
  selected: null,
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  initialState,
  // Load Products Actions
  on(ProductActionTypes.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActionTypes.loadProductSuccess, (state, action) => ({
    ...state,
    products: action.products,
    loading: false,
    error: null,
  })),

  on(ProductActionTypes.loadProductFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false,
  })),

  // Create Products Actions
  on(ProductActionTypes.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActionTypes.createProductSuccess, (state, action) => ({
    ...state,
    products: [action.product, ...state.products],
    loading: false,
  })),

  on(ProductActionTypes.createProductFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // Update products Actions
  on(ProductActionTypes.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActionTypes.updateProductSuccess, (state, action) => ({
    ...state,
    products: state.products.map((product) =>
      product.id === action.product.id ? action.product : product,
    ),
    selected: null,
    loading: false,
  })),

  on(ProductActionTypes.updateProductFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // Delete Products Actions
  on(ProductActionTypes.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActionTypes.deleteProductSuccess, (state, action) => ({
    ...state,
    products: state.products.filter((product) => product.id !== action.id),
    loading: false,
    error: null,
  })),

  on(ProductActionTypes.deleteProductFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),
);
