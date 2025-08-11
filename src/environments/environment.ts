import { Environment } from '../app/core/models/environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: '', // Defina a URL da sua API local aqui
  tokenRefreshBuffer: 30, // Segundos antes da expiração para renovar
  storagePrefix: 'angular_jwt_auth_',
  storage: {
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
  },
};
