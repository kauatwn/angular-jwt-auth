import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  JwtPayload,
  STORAGE_TOKEN,
  TokenPayload,
} from '../../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly storage = inject(STORAGE_TOKEN);

  private readonly ACCESS_TOKEN_KEY = `${environment.storagePrefix}${environment.storage.accessTokenKey}`;
  private readonly REFRESH_TOKEN_KEY = `${environment.storagePrefix}${environment.storage.refreshTokenKey}`;

  readonly accessToken = signal<string | null>(
    this.storage.getItem(this.ACCESS_TOKEN_KEY),
  );
  readonly refreshToken = signal<string | null>(
    this.storage.getItem(this.REFRESH_TOKEN_KEY),
  );

  readonly isAuthenticated = computed(() => {
    const accessToken = this.accessToken();
    const refreshToken = this.refreshToken();

    if (!accessToken || !refreshToken) return false;
    return !this.isTokenExpired(accessToken) && this.hasValidRefreshToken();
  });

  setAccessToken(token: string, expiresAt?: string): void {
    this.accessToken.set(token);
    this.storage.setItem(this.ACCESS_TOKEN_KEY, token);
    if (expiresAt) {
      this.storage.setItem(`${this.ACCESS_TOKEN_KEY}_expires_at`, expiresAt);
    }
  }

  setRefreshToken(token: string, expiresAt?: string): void {
    this.refreshToken.set(token);
    this.storage.setItem(this.REFRESH_TOKEN_KEY, token);
    if (expiresAt) {
      this.storage.setItem(`${this.REFRESH_TOKEN_KEY}_expires_at`, expiresAt);
    }
  }

  clearTokens(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.storage.removeItem(this.ACCESS_TOKEN_KEY);
    this.storage.removeItem(this.REFRESH_TOKEN_KEY);
    this.storage.removeItem(`${this.ACCESS_TOKEN_KEY}_expires_at`);
    this.storage.removeItem(`${this.REFRESH_TOKEN_KEY}_expires_at`);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJwtToken(token);
      if (!payload.expiresAt) return true;

      const now = Math.floor(Date.now() / 1000);
      return payload.expiresAt <= now + environment.tokenRefreshBuffer;
    } catch {
      return true;
    }
  }

  private hasValidRefreshToken(): boolean {
    const refreshToken = this.refreshToken();
    if (!refreshToken) return false;

    const refreshExpiresAt = this.storage.getItem(
      `${this.REFRESH_TOKEN_KEY}_expires_at`,
    );
    if (refreshExpiresAt) {
      return new Date() < new Date(refreshExpiresAt);
    }

    // Se não tem timestamp, tenta verificar pela expiração no JWT
    try {
      return !this.isTokenExpired(refreshToken);
    } catch {
      // Se não for JWT, assume válido (backend valida)
      return true;
    }
  }

  private decodeJwtToken(token: string): TokenPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );

      const jsonPayload = decodeURIComponent(
        Array.from(
          atob(padded),
          (c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`,
        ).join(''),
      );

      const jwtPayload = JSON.parse(jsonPayload) as Partial<JwtPayload>;

      return {
        subject: jwtPayload.sub || '',
        email: jwtPayload.email || '',
        issuedAt: jwtPayload.iat || 0,
        expiresAt: jwtPayload.exp || 0,
        issuer: jwtPayload.iss,
        audience: jwtPayload.aud,
        sessionId: jwtPayload.jti,
      };
    } catch (error) {
      throw new Error(`Token inválido: ${(error as Error).message}`);
    }
  }
}
