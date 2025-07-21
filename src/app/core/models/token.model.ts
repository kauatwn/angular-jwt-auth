import { InjectionToken } from '@angular/core';

export const STORAGE_TOKEN = new InjectionToken<Storage>('Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});

export interface TokenPayload {
  subject: string;
  email: string;
  issuedAt: number;
  expiresAt: number;
  issuer?: string;
  audience?: string;
  sessionId?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
  jti?: string;
}
