import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Erro inesperado';

      if (error.error?.message) {
        message = error.error.message;
      } else if (error.status === 0) {
        message = 'Erro de conexão com o servidor';
      }

      alert(message);
      return throwError(() => error);
    })
  );
};
