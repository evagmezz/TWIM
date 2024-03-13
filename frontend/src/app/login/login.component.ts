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
import { PasswordModule } from 'primeng/password'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],

  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [animate('0.5s')]),
    ]),
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
  ],
  providers: [HttpClientModule],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: [
      '',
      [Validators.pattern(/^[a-zA-Z0-9_]*$/), Validators.required],
    ],
    password: [
      '',
      [Validators.minLength(8), Validators.maxLength(20), Validators.required],
    ],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.controls.username.value || ''
      const password = this.loginForm.controls.password.value || ''
      this.authService.login({ username, password }).subscribe(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        },
      )
    }
  }
}
