import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthTokens, LoginData, User } from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.escuelajs.co/api/v1';

  login(data: LoginData): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/login`, data);
  }

  getProfile(tokens: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${tokens}`,
      },
    });
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/refresh-token`, {
      refreshToken,
    });
  }
}
