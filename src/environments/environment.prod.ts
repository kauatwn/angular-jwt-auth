import { Environment } from '../app/core/models/environment.model';

export const environment: Environment = {
  production: true,
  apiUrl: 'http://localhost:5080/api',
  tokenRefreshBuffer: 30,
  storagePrefix: 'angular_jwt_auth_',
  storage: {
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
  },
};
