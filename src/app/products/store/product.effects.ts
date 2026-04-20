import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProductService } from '../services/product';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { inject } from '@angular/core';
import * as productAction from './product.actions';
import * as productSelector from './product.selectors';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(productAction.loadProducts),
      withLatestFrom(this.store.select(productSelector.selectHasProducts)),
      filter(([, has]) => !has),
      switchMap(() =>
        this.productService.getAll().pipe(
          map((products) => productAction.loadProductSuccess({ products })),
          catchError((err) =>
            of(productAction.loadProductFailure({ error: err.message ?? 'Failed' })),
          ),
        ),
      ),
    );
  });
}
