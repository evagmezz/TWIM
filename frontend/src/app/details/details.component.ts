import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { FormsModule } from '@angular/forms'
import { NgForOf, NgIf } from '@angular/common'
import { Post, User, Comment } from '../index/index.component'
import { InputTextModule } from 'primeng/inputtext'
import { CarouselModule } from 'primeng/carousel'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    NgForOf,
    NgIf,
    InputTextModule,
    CarouselModule,
  ],
})
export class DetailsComponent implements OnInit {
  newComment: string
  post: Post
  user: User
  comments: Comment[] = []
  currentUser: User

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.paramMap.get('id')
    if (postId) {
      this.authService.details(postId).subscribe((res) => {
        this.post = res
        this.authService.getUserById(this.post.userId).subscribe((res) => {
          this.user = res
        })
        this.getComments(postId)
        this.getCurrentUser()
      })
    }
  }

  addComment() {
    if (this.newComment) {
      this.authService
        .addComment(this.currentUser.id, this.post.id, this.newComment)
        .subscribe(
          () => {
            this.newComment = ''
            this.getComments(this.post.id)
          },
          (error) => {
            console.error(error)
          },
        )
    }
  }

  getComments(postId: string) {
    this.authService.getComments(postId).subscribe((res) => {
      this.comments = res
    })
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((res) => {
      this.currentUser = res
    })
  }

  getTimeComment(comment: Comment) {
    const now = new Date()
    const createdAt = new Date(comment.createdAt)
    const diffMilliseconds = now.getTime() - createdAt.getTime()

    const diffSeconds = Math.floor(diffMilliseconds / 1000)
    if (diffSeconds < 60) {
      return `${diffSeconds} s`
    }

    const diffMinutes = Math.floor(diffMilliseconds / 1000 / 60)
    if (diffMinutes < 60) {
      return `${diffMinutes} min`
    }

    const diffHours = Math.floor(diffMilliseconds / 1000 / 60 / 60)
    if (diffHours < 24) {
      return `${diffHours} h`
    }

    const diffDays = Math.floor(diffMilliseconds / 1000 / 60 / 60 / 24)
    if (diffDays < 30) {
      return `${diffDays} días`
    }

    const diffMonths = Math.floor(diffDays / 30)
    if (diffMonths < 12) {
      return `${diffMonths} sem`
    }

    const diffYears = Math.floor(diffMonths / 12)
    return `${diffYears} años`
  }
}
