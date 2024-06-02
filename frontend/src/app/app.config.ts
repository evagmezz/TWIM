import { ApplicationConfig } from '@angular/core'
import { MessageService } from 'primeng/api'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideAnimations } from '@angular/platform-browser/animations'
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http'
import { AuthInterceptor } from './interceptors/auth-interceptor.interceptor'
import { ErrorHttpInterceptor } from './interceptors/error-http-interceptor.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHttpInterceptor, multi: true },
  ],
}
