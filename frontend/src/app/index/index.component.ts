import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common'
import { CardModule } from 'primeng/card'
import { RatingModule } from 'primeng/rating'
import { TagModule } from 'primeng/tag'
import { ButtonModule } from 'primeng/button'
import { FormsModule } from '@angular/forms'
import { DataViewLazyLoadEvent, DataViewModule } from 'primeng/dataview'

export class Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: string
  user: User
}

export class Post {
  user: User
  title: string
  photos: string[]
  createdAt: string
  updatedAt: string
  comments: Comment[]
  id: string
  likes: string[]
}

export class User {
  id: string
  name: string
  lastname: string
  username: string
  password: string
  email: string
  image: string
  role: string
  createdAt: string
  updatedAt: string
  followers: User[]
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterOutlet, NgForOf, CardModule, NgIf, AsyncPipe, DataViewModule, RatingModule, TagModule, ButtonModule, NgClass, FormsModule, DataViewModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  posts: Post[]
  users: User[]

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.lazyLoad()
  }

  postDetails(id: string): void {
    this.router.navigate(['details', id])
  }

  totalRecords: number = 0

  lazyLoad() {
    this.authService.getUsers().subscribe((data) => {
      this.users = data
    })

    this.authService.index().subscribe((data) => {
      this.posts = data.docs
      this.totalRecords = data.totalDocs
    })
  }

  goToProfile(id: string): void {
    this.router.navigate([id, 'profile'])
  }
}
