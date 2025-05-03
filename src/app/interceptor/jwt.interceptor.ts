import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = request;
    return next.handle(authReq).pipe(catchError(
      (error) => {
        if (error instanceof HttpErrorResponse && !authReq.url.includes('login') && error.status === 401) {
          return this.handle401Error(authReq, next)!;
        }
      return throwError(() => {
        return error;
      });
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = localStorage.getItem('access_token');
      const refToken = localStorage.getItem('refresh_token');

      if (token && refToken) {
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            localStorage.setItem('access_token', token.access_token);
            console.log(token)
            this.refreshTokenSubject.next(token.access_token);
            return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError(() => {
            this.isRefreshing = false;
            return throwError(() => {
              return new Error('Error handling 401 request.')
            });
          })
        );
      }
  }
  this.authService.logout();
  return this.refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => next.handle(this.addTokenHeader(request, token)))
  );
}

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)});
  }
}