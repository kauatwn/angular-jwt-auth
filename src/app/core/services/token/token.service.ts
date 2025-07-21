import { effect, inject, Injectable, signal } from '@angular/core';
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

  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  readonly authEffect = effect(() => {
    this._isAuthenticated.set(this.hasValidTokens());
  });

  getAccessToken(): string | null {
    return this.storage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    this.storage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.updateAuthState();
  }

  setRefreshToken(token: string): void {
    this.storage.setItem(this.REFRESH_TOKEN_KEY, token);
    this.updateAuthState();
  }

  // Limpar todos os tokens
  clearTokens(): void {
    this.storage.removeItem(this.ACCESS_TOKEN_KEY);
    this.storage.removeItem(this.REFRESH_TOKEN_KEY);
    this.storage.removeItem(`${this.ACCESS_TOKEN_KEY}_expires_at`);
    this.storage.removeItem(`${this.REFRESH_TOKEN_KEY}_expires_at`);
    this._isAuthenticated.set(false);
  }

  // Definir ambos os tokens com timestamps
  saveTokens(
    accessToken: string,
    refreshToken: string,
    accessExpiresAt?: string,
    refreshExpiresAt?: string,
  ): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);

    // Salvar timestamps se fornecidos
    if (accessExpiresAt) {
      this.storage.setItem(
        `${this.ACCESS_TOKEN_KEY}_expires_at`,
        accessExpiresAt,
      );
    }
    if (refreshExpiresAt) {
      this.storage.setItem(
        `${this.REFRESH_TOKEN_KEY}_expires_at`,
        refreshExpiresAt,
      );
    }

    // Forçar atualização do estado de autenticação
    this.updateAuthState();
  }

  // Verificar se há tokens válidos
  hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    // Se temos refresh token válido, consideramos autenticado
    // O access token pode estar expirado mas será renovado pelo interceptor
    return this.hasValidRefreshToken();
  }

  // Verificar se o refresh token está válido (não expirado)
  private hasValidRefreshToken(): boolean {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    // Primeiro, verificar se temos um timestamp salvo
    const refreshExpiresAt = this.storage.getItem(
      `${this.REFRESH_TOKEN_KEY}_expires_at`,
    );
    if (refreshExpiresAt) {
      const expirationDate = new Date(refreshExpiresAt);
      const now = new Date();
      const isExpired = now >= expirationDate;
      return !isExpired;
    }

    // Para refresh tokens que são JWTs, verificar expiração
    try {
      const isExpired = this.isTokenExpired(refreshToken);
      return !isExpired;
    } catch (error) {
      // Se não for JWT (string aleatória), assumir que está válido
      // O backend será responsável por validar
      return true;
    }
  }

  // Verificar se o token está expirado
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJwtToken(token);

      if (!payload.expiresAt) return true;

      // Adicionar margem de 30 segundos antes da expiração
      const now = Math.floor(Date.now() / 1000);
      return payload.expiresAt <= now + 30;
    } catch (error) {
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

      // Mapear campos do JWT padrão para nosso TokenPayload
      return {
        subject: jwtPayload.sub || '',
        email: jwtPayload.email || '',
        issuedAt: jwtPayload.iat || 0,
        expiresAt: jwtPayload.exp || 0, // Mapear 'exp' para 'expiresAt'
        issuer: jwtPayload.iss,
        audience: jwtPayload.aud,
        sessionId: jwtPayload.jti,
      };
    } catch (error) {
      throw new Error(`Token inválido: ${(error as Error).message}`);
    }
  }

  // Atualizar estado de autenticação
  private updateAuthState(): void {
    this._isAuthenticated.set(this.hasValidTokens());
  }
}
