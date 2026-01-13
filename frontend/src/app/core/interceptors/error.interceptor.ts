import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if ([400, 422].includes(error.status)) {
        return throwError(() => error);
      }

      let message = 'Erro inesperado';

      if (error.status === 0) {
        message = 'Erro de conexão com o servidor';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      alert(message);
      return throwError(() => error);
    })
  );
};
