import { Component } from '@angular/core'
import { AuthService } from './services/auth.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component'

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [AuthService, HttpClient],
  imports: [HttpClientModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'TWIM'
}
