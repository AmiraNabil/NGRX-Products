import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed } from '@angular/core';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { LoginData, User } from '../models/auth.model';
import { AuthService } from '../services/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withDevtools('auth'),
  withState(initialState),

  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.accessToken()),
    userName: computed(() => store.user()?.name),
    userAvatar: computed(() => store.user()?.avatar),
    userRole: computed(() => store.user()?.role),
  })),

  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    login: rxMethod<LoginData>(
      pipe(
        tap(() => updateState(store, '[Auth] Login Start', { loading: true, error: null })),
        switchMap((loginData) =>
          authService.login(loginData).pipe(
            tap((tokens) => {
              localStorage.setItem('access_token', tokens.access_token);
              localStorage.setItem('refresh_token', tokens.refresh_token);

              updateState(store, '[Auth] Login Success', {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                loading: false,
                error: null,
              });

              authService.getProfile(tokens.access_token).subscribe((user) => {
                updateState(store, '[Auth] Get Profile Success', { user });
              });

              router.navigate(['/products']);
            }),
            catchError((err) => {
              updateState(store, '[Auth] Login Failure', {
                loading: false,
                error: 'Invalid email or password Please try again',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    loadProfile: rxMethod<void>(
      pipe(
        switchMap(() => {
          const token = store.accessToken();
          if (!token) return EMPTY;

          return authService.getProfile(token).pipe(
            tap((user) => updateState(store, '[Auth] Load Profile Success', { user })),
            catchError(() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              updateState(store, '[Auth] Token Expired', {
                accessToken: null,
                refreshToken: null,
                user: null,
              });
              return EMPTY;
            }),
          );
        }),
      ),
    ),

    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      updateState(store, '[Auth] Logout', {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      });
      router.navigate(['/auth/login']);
    },

    clearError() {
      updateState(store, '[Auth] Clear Error', { error: null });
    },
  })),
);
