import { ApplicationConfig } from '@angular/core'
import { MessageService } from 'primeng/api'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideAnimations } from '@angular/platform-browser/animations'

export const appConfig: ApplicationConfig = {
  providers: [MessageService, provideRouter(routes), provideAnimations()],
}
