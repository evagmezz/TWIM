import {Component, OnInit} from '@angular/core'
import { NgOptimizedImage, NgStyle } from '@angular/common';
import {Router} from '@angular/router'
import {AuthService} from '../services/auth.service'
import {ButtonModule} from 'primeng/button'
import {DialogModule} from 'primeng/dialog'
import {InputTextModule} from 'primeng/inputtext'
import {PaginatorModule} from 'primeng/paginator'
import {PasswordModule} from 'primeng/password'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {User} from '../models/user'
import {FileUploadModule} from 'primeng/fileupload'
import {debounceTime, Subject} from 'rxjs'
import {IconFieldModule} from 'primeng/iconfield'
import {InputIconModule} from 'primeng/inputicon'
import {Role} from "../models/roles"

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    PaginatorModule,
    PasswordModule,
    ReactiveFormsModule,
    NgStyle,
    FileUploadModule,
    IconFieldModule,
    InputIconModule,
    NgOptimizedImage
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {

  visibleCreate: boolean = false
  searchSubject = new Subject<string>()
  currentUser: User
  image: File[] = []
  searchResults: User[] = []
  role: Role[] | undefined
  visibleSearch: boolean = false
  visibleCreateUser: boolean = false
  submitted: boolean = false
  isAdmin: boolean = false

  createPostForm = this.fb.group({
    title: ['', [Validators.required]],
    image: this.fb.array([], [Validators.required, Validators.maxLength(7)]),
    location: [''],
  })

  createUserForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóú ]*$/)]],
    lastname: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóú ]*$/)]],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/),
      ],
    ],
    password: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    role: ['', [Validators.required]]
  })


  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user
    })

    if (this.shouldShowHeader()) {
      this.lazyLoad()
    }
    this.searchSubject.pipe(debounceTime(100)).subscribe(searchValue => {
      this.search(searchValue)
    })
    this.isAdmin = this.authService.isAdmin()
    this.role = [
      {name: 'admin'},
      {name: 'user'}
    ]
  }

  lazyLoad() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })
  }


  onFileChange(event: any): void {
    if (event.currentFiles.length > 0) {
      this.image = event.currentFiles
    }
  }
  createUser() {
    const formData = new FormData()
    formData.append('name', this.createUserForm.controls.name.value as string)
    formData.append('lastname', this.createUserForm.controls.lastname.value as string)
    formData.append('username', this.createUserForm.controls.username.value as string)
    formData.append('password', this.createUserForm.controls.password.value as string)
    formData.append('email', this.createUserForm.controls.email.value as string)
    formData.append('role', this.createUserForm.controls.role.value as string)
    this.authService.createUser(formData).subscribe(() => {
      this.visibleCreateUser = false
    })
  }


  createPost(): void {
    const userId = this.currentUser.id
    const title = this.createPostForm.controls.title.value as string
    const image = this.image
    const location = this.createPostForm.controls.location.value as string
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('title', title)
    formData.append('location', location)
    for (let i = 0; i < image.length; i++) {
      formData.append('image', image[i])
    }

    this.authService.createPost(formData).subscribe(() => {
      this.visibleCreate = false
      this.router.navigate([`${userId}/profile`])
    })
  }

  shouldShowHeader(): boolean {
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

  search(username: string): void {
    this.authService.searchBy(username).subscribe(results => {
      if (Array.isArray(results.data)) {
        this.searchResults = results.data
      } else {
        this.searchResults = []
      }
    })
  }

  goProfile(id: string): void {
    this.router.navigate([id, 'profile'])
    this.visibleSearch = false
  }

  goToAdmin(): void {
    this.router.navigate(['admin'])
  }
}
