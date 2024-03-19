import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { NgForOf, NgIf } from '@angular/common'
import { CardModule } from 'primeng/card'

export class Post {
  userId: string
  title: string
  text: string
  photos: string[]
  createdAt: string
  updatedAt: string
  comments: string[]
  id: string
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
  imports: [RouterOutlet, NgForOf, CardModule, NgIf],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  posts: Post[] = []
  users: User[] = []

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.index().subscribe((res) => {
      this.posts = res.docs
      this.posts.forEach((post) => {
        this.authService.getUserById(post.userId).subscribe((user) => {
          this.users.push(user)
        })
      })
    })
  }

  getUserByUserId(userId: string) {
    return this.users.find((user) => user.id === userId)
  }

  postDetails(postId: string): void {
    this.router.navigate(['details', postId])
  }

  onSubmit(): void {
    // ...
  }
}
