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

  followingCount: number = 0

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.paramMap.get('id') as string
    this.authService.getUserById(userId).subscribe((user) => {
      this.user = user
    })
    this.authService.getUserPosts(userId).subscribe((posts) => {
      this.posts = posts
    })
    this.authService.getFollowing(userId).subscribe((following) => {
      this.followingCount = following.length
    })
  }

  countFollowers(): number {
    return this.user.followers.length
  }

  countFollowing() {}

  postDetails(postId: string): void {
    this.router.navigate(['details', postId])
  }
}
