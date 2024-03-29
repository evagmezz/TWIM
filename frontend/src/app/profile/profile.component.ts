import { Component, OnInit } from '@angular/core'
import { Post, User } from '../index/index.component'
import { AuthService } from '../services/auth.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NgForOf, NgIf } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { SidebarModule } from 'primeng/sidebar'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { FileUploadModule } from 'primeng/fileupload'
import { MessageSharingService } from '../services/message-sharing-service.service'
import { Message } from 'primeng/api'
import { RadioButtonModule } from 'primeng/radiobutton'


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgForOf, ButtonModule, DialogModule, RadioButtonModule, SidebarModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, FileUploadModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageSharingService,
  ) {
  }

  profileForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: [''],
  })
  deleteProfileForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  message: Message[]
  user: User
  posts: Post[]
  currentUser: User
  followers: User[]
  followings: User[]
  likedPosts: Post[]
  selectedFile: File
  isFollowing: boolean = true
  visibleFollowers: boolean = false
  visibleFollowing: boolean = false
  visibleLikedPosts: boolean = false
  visibleEditProfile: boolean = false
  visibleDeleteProfile: boolean = false
  followingCount: number = 0


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser
      this.profileForm.patchValue(currentUser)
    })
    this.messageService.currentMessage.subscribe(
      (message) => (this.message = message),
    )
    this.lazyLoad()
  }

  lazyLoad(): void {
    const userId = this.activatedRoute.snapshot.paramMap.get('id') as string
    this.authService.getUserById(userId).subscribe((user) => {
      this.user = user
      this.followers = user.followers
    })
    this.authService.getUserPosts(userId).subscribe((posts) => {
      this.posts = posts
    })
    this.authService.getFollowing(userId).subscribe((following) => {
      this.followingCount = following.length
      this.followings = following
    })
  }

  postDetails(postId: string): void {
    this.router.navigate(['details', postId])
  }

  updateProfile(): void {
    this.visibleEditProfile = true
    if (this.profileForm.valid) {
      const name = this.profileForm.controls.name.value || ''
      const lastname = this.profileForm.controls.lastname.value || ''
      const username = this.profileForm.controls.username.value || ''
      const email = this.profileForm.controls.email.value || ''
      const password = this.profileForm.controls.password.value || ''

      const updateData = new FormData()
      updateData.append('name', name)
      updateData.append('lastname', lastname)
      updateData.append('username', username)
      updateData.append('email', email)
      if (password) {
        updateData.append('password', password)
      }
      if (this.selectedFile) {
        updateData.append('image', this.selectedFile)
      }

      this.authService.updateProfile(updateData).subscribe(
        (res) => {
          console.log(res)
          this.visibleEditProfile = false
          this.lazyLoad()
        },
      )
    }
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]
    }
  }

  deleteProfile(): void {
    if (this.deleteProfileForm.valid) {
       const username = this.deleteProfileForm.controls.username.value as string
      const password = this.deleteProfileForm.controls.password.value as string
      this.authService.checkUser(username, password,).subscribe(isCorrect => {
        if (isCorrect) {
          this.authService.deleteProfile().subscribe(
            () => {
              this.router.navigate(['login'])
            },
          )
        } else {
          this.messageService.changeMessage([
            { severity: 'error', summary: 'Error', detail: 'Las credenciales no coinciden' },
          ])
        }
      })
    }
  }

  follow(): void {
    this.authService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser
      const userId = this.activatedRoute.snapshot.paramMap.get('id') as string
      this.isFollowing = true
      this.authService.follow(this.currentUser.id, userId).subscribe(() => {
        this.lazyLoad()
      })
    })
  }

  unFollow(): void {
    this.authService.getCurrentUser().subscribe((currentUser) => {
      const userId = this.activatedRoute.snapshot.paramMap.get('id') as string
      console.log(userId, currentUser.id)
      this.isFollowing = false
      this.authService.unfollow(currentUser.id, userId).subscribe(() => {
        this.lazyLoad()
      })
    })
  }

  showFollowers() {
    this.visibleFollowers = true
  }

  showFollowing() {
    this.visibleFollowing = true
  }

  countFollowers(): number {
    return this.user.followers.length
  }

  viewLikedPosts(): void {
    this.visibleLikedPosts = true
    const userId = this.activatedRoute.snapshot.paramMap.get('id') as string
    this.authService.getPostsLikedByUser(userId).subscribe((posts) => {
      this.likedPosts = posts
    })
  }

}
