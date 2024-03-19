import { Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { IndexComponent } from './index/index.component'
import { DetailsComponent } from './details/details.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'index',
    component: IndexComponent,
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
  },
]
