import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common'
import { CardModule } from 'primeng/card'
import { RatingModule } from 'primeng/rating'
import { TagModule } from 'primeng/tag'
import { ButtonModule } from 'primeng/button'
import { FormsModule } from '@angular/forms'
import { DataViewModule } from 'primeng/dataview'
import { DialogModule } from 'primeng/dialog';

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
  imports: [RouterOutlet, NgForOf, CardModule, NgIf, AsyncPipe, DataViewModule, RatingModule, TagModule, ButtonModule, NgClass, FormsModule, DataViewModule, DialogModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {

  posts: Post[]
  users: User[]
  currentUser: User
  post: Post
  visibleAddComment: boolean = false

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }


  ngOnInit(): void {
    this.lazyLoad()
  }

  postDetailsDialog(id: string): void {
    this.visibleAddComment = true
    this.router.navigate(['index', 'details', id])
  }

  postDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  onDialogHide(): void {
    this.router.navigate(['index']);
  }

  totalRecords: number = 0

  lazyLoad() {
    this.authService.getUsers().subscribe((data) => {
      this.users = data
    })
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    })
    this.authService.index().subscribe((data) => {
      this.posts = data.docs
      this.totalRecords = data.totalDocs
    })
  }

  goToProfile(id: string): void {
    this.router.navigate([id, 'profile'])
  }

  isLiked(post: Post): boolean {
    if (this.currentUser) {
      return post.likes.includes(this.currentUser.id);
    }
    return false;
  }

  likePost(post: Post): void {
    if (this.isLiked(post)) {
      const index = post.likes.indexOf(this.currentUser.id);
      if (index > -1) {
        post.likes.splice(index, 1);
      }
      this.authService.unlike(post.id, this.currentUser.id).subscribe(
        () => {
        },
      );
    } else {
      post.likes.push(this.currentUser.id);

      this.authService.like(post.id, this.currentUser.id).subscribe(
        () => {
        },
      );
    }
  }

}
