import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { FormsModule } from '@angular/forms'
import { NgForOf, NgIf } from '@angular/common'
import { Comment, Post, User } from '../index/index.component'
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
      this.authService.details(postId).subscribe((post) => {
        this.post = post
        this.authService.getUserById(this.post.userId).subscribe((user) => {
          this.user = user
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
    this.authService.getComments(postId).subscribe((comment) => {
      this.comments = comment.map((comment) => {
        this.authService.getUserById(comment.userId).subscribe((user) => {
          comment.user = user
        })
        return comment
      })
    })
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })
  }

  deleteComment(comment: Comment) {
    if (this.currentUser.id === comment.user.id) {
      this.authService.deleteComment(comment.id).subscribe(
        () => {
          this.getComments(this.post.id)
        },
        (error) => {
          console.error(error)
        },
      )
    } else {
      console.error('You can only delete your own comments')
    }
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

  isLiked(): boolean {
    return this.post.likes.includes(this.currentUser.id)
  }

  likePost(): void {
    if (this.isLiked()) {
      const index = this.post.likes.indexOf(this.currentUser.id)
      if (index > -1) {
        this.post.likes.splice(index, 1)
      }
      this.authService.unlike(this.post.id, this.currentUser.id).subscribe(
        () => {
          console.log('Like removed successfully')
        },
        (error) => {
          console.error('Error removing like', error)
        },
      )
    } else {
      this.post.likes.push(this.currentUser.id)

      this.authService.like(this.post.id, this.currentUser.id).subscribe(
        () => {
          console.log('Like saved successfully')
        },
        (error) => {
          console.error('Error saving like', error)
        },
      )
    }
  }
}
