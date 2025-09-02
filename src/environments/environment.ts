import { Environment } from '../app/core/models/environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: '', // Defina a URL completa da API para desenvolvimento. Ex.: 'http://localhost:5000', 'http://localhost:8080', etc.
  tokenRefreshBuffer: 30,
  storagePrefix: 'angular_jwt_auth_',
  storage: {
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
  },
};
