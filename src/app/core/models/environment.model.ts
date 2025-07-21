export interface StorageKeys {
  accessTokenKey: string;
  refreshTokenKey: string;
}

export interface Environment {
  production: boolean;
  apiUrl: string;
  tokenRefreshBuffer: number;
  storagePrefix: string;
  storage: StorageKeys;
}
