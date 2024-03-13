import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { HttpClientModule } from '@angular/common/http'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule],
  providers: [HttpClientModule],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value
      this.authService
        .login({ username: username || '', password: password || '' })
        .subscribe(
          (response) => {
            localStorage.setItem('access_token', response.access_token)
          },
          (error) => {
            alert(`Error al iniciar sesión: ${error.message}`)
          },
        )
    }
  }
}
