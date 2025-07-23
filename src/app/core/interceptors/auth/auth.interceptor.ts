import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../services/token/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const accessToken = tokenService.accessToken();
  const isTokenValid = accessToken && !tokenService.isTokenExpired(accessToken);

  let authorizedRequest = req;
  if (isTokenValid) {
    authorizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status !== HttpStatusCode.Unauthorized) {
        return throwError(() => error);
      }

      const refreshToken = tokenService.refreshToken();

      if (!refreshToken) {
        tokenService.clearTokens();
        return throwError(() => error);
      }

      return authService.refreshToken({ refreshToken }).pipe(
        switchMap((tokens) => {
          const retriedRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });
          return next(retriedRequest);
        }),
        catchError((refreshError: unknown) => {
          tokenService.clearTokens();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
