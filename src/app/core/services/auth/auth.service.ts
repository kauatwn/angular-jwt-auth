import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AuthSessionResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserProfileResponse,
} from '../../models/auth.model';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  getUserProfile() {
    return this.http.get<UserProfileResponse>(`${environment.apiUrl}/users/me`);
  }

  register(request: RegisterRequest) {
    return this.http
      .post<AuthSessionResponse>(`${this.baseUrl}/register`, request)
      .pipe(
        tap(
          ({
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
          }) => {
            this.tokenService.setAccessToken(accessToken, accessTokenExpiresAt);
            this.tokenService.setRefreshToken(
              refreshToken,
              refreshTokenExpiresAt,
            );
          },
        ),
      );
  }

  login(credentials: LoginRequest) {
    return this.http
      .post<AuthSessionResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(
          ({
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
          }) => {
            this.tokenService.setAccessToken(accessToken, accessTokenExpiresAt);
            this.tokenService.setRefreshToken(
              refreshToken,
              refreshTokenExpiresAt,
            );
          },
        ),
      );
  }

  refreshToken(request: RefreshTokenRequest) {
    return this.http
      .post<AuthSessionResponse>(`${this.baseUrl}/refresh-token`, request)
      .pipe(
        tap(
          ({
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
          }) => {
            this.tokenService.setAccessToken(accessToken, accessTokenExpiresAt);
            this.tokenService.setRefreshToken(
              refreshToken,
              refreshTokenExpiresAt,
            );
          },
        ),
      );
  }

  logout() {
    this.tokenService.clearTokens();
  }
}
