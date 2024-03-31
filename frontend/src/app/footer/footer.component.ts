import { Component, OnInit } from '@angular/core'
import { NgIf } from '@angular/common'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { InputTextModule } from 'primeng/inputtext'
import { PaginatorModule } from 'primeng/paginator'
import { PasswordModule } from 'primeng/password'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { User } from '../index/index.component'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgIf,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PaginatorModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {

  visibleCreate:  boolean = false
  currentUser: User
  image: File[] = []

/*  createPostForm = this.fb.group({
    title: ['', [Validators.required]],
    image: this.fb.array([], [Validators.required, Validators.maxLength(7)]),
  })*/

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
      this.lazyLoad()
    }

  lazyLoad() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })
  }

  shouldShowFooter(): boolean {
    const url = this.router.url
    return url !== '/login' && url !== '/register'
  }

  goToMyProfile(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.router.navigate([`${user.id}/profile`])
    })
  }

  goToIndex(): void {
    this.router.navigate(['index'])
  }
}
