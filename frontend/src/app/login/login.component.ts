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
import { Router, RouterLink } from '@angular/router'
import { NgClass } from '@angular/common';
import { MessagesModule } from 'primeng/messages'
import { MessageSharingService } from '../services/message-sharing-service.service'
import { Message } from 'primeng/api'

export class Token {
  access_token: string
}

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
    NgClass,
    MessagesModule
],
  providers: [HttpClientModule],
})
export class LoginComponent implements OnInit {
  message: Message[]
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageSharingService,
  ) {}

  ngOnInit() {
    this.messageService.currentMessage.subscribe(
      (message) => (this.message = message),
    )
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.controls.username.value || ''
      const password = this.loginForm.controls.password.value || ''
      this.authService
        .login({ username, password })
        .subscribe(
          (data: Token) => {
            localStorage.setItem('access_token', data.access_token)
            this.router.navigate(['index'])
          },
          () => {
            this.messageService.changeMessage([
              { severity: 'error', summary: 'Error', detail: 'Nombre de usuario o contraseña incorrectos' },
            ])
          }
        )
    } else {
      this.messageService.changeMessage([
        { severity: 'error', summary: 'Error', detail: 'Por favor, rellene todos los campos' },
      ])
    }
  }
}
