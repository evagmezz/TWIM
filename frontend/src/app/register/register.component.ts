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
import { RouterLink } from '@angular/router'
import { CommonModule, NgIf } from '@angular/common'
import { DividerModule } from 'primeng/divider'
import { MessagesModule } from 'primeng/messages'
import { Message } from 'primeng/api'
import { FileUploadModule } from 'primeng/fileupload'

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
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
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
  ) {}

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]
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
    if (this.registerForm.valid && this.selectedFile) {
      const name = this.registerForm.controls.name.value || ''
      const lastname = this.registerForm.controls.lastname.value || ''
      const username = this.registerForm.controls.username.value || ''
      const password = this.registerForm.controls.password.value || ''
      const email = this.registerForm.controls.email.value || ''
      const repeatPwd = this.registerForm.controls.repeatPwd.value || ''

      const formData = new FormData()
      formData.append('name', name)
      formData.append('lastname', lastname)
      formData.append('username', username)
      formData.append('password', password)
      formData.append('email', email)
      formData.append('repeatPwd', repeatPwd)
      formData.append('image', this.selectedFile)

      this.authService.register(formData).subscribe(
        (res) => {
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
