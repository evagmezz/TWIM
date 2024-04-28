import { Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { IndexComponent } from './index/index.component'
import { DetailsComponent } from './details/details.component'
import { ProfileComponent } from './profile/profile.component'

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
    children: [
      {
        path: 'details/:id',
        component: DetailsComponent
      }
    ]
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
  },
  {
    path: ':id/profile',
    component: ProfileComponent,
  },
  {
    path: 'me/profile',
    component: ProfileComponent,
  }
]
