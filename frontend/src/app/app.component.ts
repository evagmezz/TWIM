import { Component } from '@angular/core'
import { AuthService } from './services/auth.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component'
import { RouterOutlet } from '@angular/router'
import { RegisterComponent } from './register/register.component'

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [AuthService, HttpClient],
  imports: [HttpClientModule, LoginComponent, RouterOutlet, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'TWIM'
}
