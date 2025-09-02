import { Environment } from '../app/core/models/environment.model';

export const environment: Environment = {
  production: true,
  apiUrl: '/api', // Caminho relativo para o proxy
  tokenRefreshBuffer: 30,
  storagePrefix: 'angular_jwt_auth_',
  storage: {
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
  },
};
