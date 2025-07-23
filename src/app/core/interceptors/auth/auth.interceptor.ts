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

  // Clonar request adicionando o header Authorization se existir token válido
  const accessToken = tokenService.getAccessToken();

  let authorizedRequest = req;
  if (accessToken) {
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

      // Só tentamos o refresh se for erro 401 (unauthorized)
      if (error.status !== HttpStatusCode.Unauthorized) {
        return throwError(() => error);
      }

      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        tokenService.clearTokens();
        return throwError(() => error);
      }

      return authService.refreshToken({ refreshToken }).pipe(
        switchMap((tokens) => {
          // Após renovar token, repetir a requisição original com novo token
          const retriedRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });
          return next(retriedRequest);
        }),
        catchError((refreshError: unknown) => {
          // Se falhar no refresh, limpar tokens e propagar erro
          tokenService.clearTokens();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
