import { Injectable } from '@angular/core'
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import { Router } from '@angular/router'

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {
  constructor(private route: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.route.navigate(['login'])
        }
        return throwError(error)
      }),
    )
  }
}
