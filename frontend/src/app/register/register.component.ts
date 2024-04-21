import { Component, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from '../services/auth.service'
import { Router, RouterLink } from '@angular/router'
import { CommonModule, NgIf } from '@angular/common'
import { DividerModule } from 'primeng/divider'
import { MessagesModule } from 'primeng/messages'
import { Message } from 'primeng/api'
import { FileUploadModule } from 'primeng/fileupload'
import { MessageSharingService } from '../services/message-sharing-service.service'

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    NgIf,
    DividerModule,
    MessagesModule,
    FileUploadModule,
  ],
  providers: [HttpClientModule],
})
export class RegisterComponent implements OnInit {
  messages: Message[]
  selectedFile: File
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
    lastname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]*$/),
      ],
    ],
    password: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    repeatPwd: ['', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageSharingService,
  ) {}

  onFileChange(event: any): void {
    if (event.currentFiles.length > 0) {
      this.selectedFile = event.currentFiles[0];
    }
  }

  ngOnInit(): void {
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.checkPassword()
    })

    this.registerForm.controls.repeatPwd.valueChanges.subscribe(() => {
      this.checkPassword()
    })
  }

  checkPassword() {
    const form = this.registerForm
    const password = form.get('password')
    const repeatPwd = form.get('repeatPwd')

    if (password && repeatPwd) {
      if (password.value !== repeatPwd.value) {
        repeatPwd.setErrors({ notEquivalent: true })
      } else {
        repeatPwd.setErrors(null)
      }
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const name = this.registerForm.controls.name.value as string
      const lastname = this.registerForm.controls.lastname.value as string
      const username = this.registerForm.controls.username.value as string
      const password = this.registerForm.controls.password.value as string
      const email = this.registerForm.controls.email.value as string
      const repeatPwd = this.registerForm.controls.repeatPwd.value as string
      const image = this.selectedFile

      const formData = new FormData()
      formData.append('name', name)
      formData.append('lastname', lastname)
      formData.append('username', username)
      formData.append('password', password)
      formData.append('email', email)
      formData.append('repeatPwd', repeatPwd)
      if (this.selectedFile) {
        formData.append('image', image)
      }

      this.authService.register(formData).subscribe(
        (res) => {
          this.messageService.changeMessage([
            {
              severity: 'success',
              summary: 'Registro exitoso',
              detail: 'Usuario registrado correctamente',
            },
          ])
          this.router.navigate(['/login'])
          console.log(res)
        },
        (err) => {
          console.log(err)
        },
      )
    } else {
      this.messages = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Formulario inválido, rellene todos los campos correctamente',
        },
      ]
    }
  }
}
