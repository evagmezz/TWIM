import { ApplicationConfig } from '@angular/core'
import { MessageService } from 'primeng/api'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [MessageService, provideRouter(routes)],
}
