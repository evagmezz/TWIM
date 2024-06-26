import { Injectable } from '@angular/core'
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('access_token')

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })

      return next.handle(cloned)
    } else {
      return next.handle(req)
    }
  }
}
