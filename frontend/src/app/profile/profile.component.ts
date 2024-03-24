import { Component, OnInit } from '@angular/core'
import { Post, User } from '../index/index.component'
import { AuthService } from '../services/auth.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NgForOf, NgIf } from '@angular/common'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User
  posts: Post[]

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.paramMap.get('id')
    if (userId) {
      this.authService.getUserById(userId).subscribe(
        (user) => {
          this.user = user
        },
        (error) => {
          console.error(error)
        },
      )
      this.authService.getUserPosts(userId).subscribe(
        (posts) => {
          this.posts = posts
        },
        (error) => {
          console.error(error)
        },
      )
    }
  }
  countFollowers(): number {
    return this.user.followers.length
  }

  countFollowing(): number {
    let followingCount = 0
    this.authService.getFollowing(this.user.id).subscribe(
      (following) => {
        followingCount = following.length
      },
      (error) => {
        console.error(error)
      },
    )
    return followingCount
  }

  postDetails(postId: string): void {
    this.router.navigate(['details', postId])
  }
}
