import { Component } from '@angular/core'
import { AuthService } from './services/auth.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component'
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router'
import { RegisterComponent } from './register/register.component'
import { IndexComponent } from './index/index.component'
import { NgIf } from '@angular/common'
import { DetailsComponent } from './details/details.component'

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [AuthService, HttpClient],
  imports: [
    HttpClientModule,
    LoginComponent,
    RouterOutlet,
    RegisterComponent,
    IndexComponent,
    NgIf,
    DetailsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'TWIM'

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  shouldShowFooter(): boolean {
    const url = this.router.url
    return url !== '/login' && url !== '/register'
  }
}
