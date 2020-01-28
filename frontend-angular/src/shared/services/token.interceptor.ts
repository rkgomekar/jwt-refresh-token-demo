import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

// import { Observable, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    constructor(private router: Router, private loginService: LoginService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('token');
        if (token != null) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        }
        return next.handle(req).pipe(
            catchError(err => {
                console.log("err", err);
                if (err.status === 401) {
                    // this.refreshToken(req, next);
                    return this.handle401Error(req, next);
                }
                throw err;
            }
            ));
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.loginService.refreshToken().pipe(
                switchMap((response: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(response.token);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('refreshToken', response.refreshToken);
                    return next.handle(this.addToken(request, response.token));
                }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                }));
        }
    }

    /*
    private refreshToken(oldReq: HttpRequest<any>, next: HttpHandler) {

        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

            this.loginService.refreshToken().subscribe(res => {
                this.isRefreshingToken = false;
                this.tokenSubject.next(res['token']);

                console.log('res', res);
                localStorage.setItem('token', res['token']);
                localStorage.setItem('refreshToken', res['refreshToken']);

                oldReq = oldReq.clone({
                    setHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                return next.handle(oldReq);

            }, error => {

            });

        }

    }
    */

}

