import { Component, OnInit } from '@angular/core'
import { Post, User } from '../index/index.component'
import { AuthService } from '../services/auth.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NgForOf, NgIf } from '@angular/common'
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgForOf, ButtonModule, DialogModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User
  posts: Post[]
  currentUser: User
  followers: User[]
  followings: User[]
  isFollowing: boolean = true
  visibleFollowers: boolean = false;
  visibleFollowing: boolean = false;

  showFollowers() {
    this.visibleFollowers = true;
  }
  showFollowing() {
    this.visibleFollowing = true;
  }

  followingCount: number = 0

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser
    })
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

  countFollowers(): number {
    return this.user.followers.length
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

  postDetails(postId: string): void {
    this.router.navigate(['details', postId])
  }
}
