import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { NgForOf } from '@angular/common'

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

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterOutlet, NgForOf],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  posts: Post[] = []
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.index().subscribe((res) => {
      this.posts = res.docs
    })
  }

  onSubmit(): void {
    // ...
  }
}
