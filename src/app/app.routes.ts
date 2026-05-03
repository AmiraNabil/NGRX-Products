import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
