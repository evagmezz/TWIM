import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { Comment, Post, User } from '../index/index.component';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';

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
    ButtonModule,
    DialogModule,
    SidebarModule,
  ],
})
export class DetailsComponent implements OnInit {

  newComment: string;
  post: Post
  users: User[]
  comments: Comment[]
  currentUser: User
  visibleOptions: boolean = false
  visibleEditPost: boolean = false

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id') as string;
      this.lazyLoad(postId);
    });
  }


  lazyLoad(postId: string) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.authService.getUsers().subscribe((data) => {
      this.users = data;
    });

    this.authService.details(postId).subscribe((data) => {
      this.post = data;

      this.authService.getComments(postId).subscribe((data) => {
        this.comments = data;
      });
    });
  }

  editPost() {
    this.authService.updatePost(this.post.id, this.post.title).subscribe(
      () => {
        this.visibleEditPost = false;
        this.visibleOptions = false;
      },
    );
  }

  deletePost() {
    this.authService.deletePost(this.post.id).subscribe(
      () => {
        this.router.navigate(['index']);
      },
    )
  }

  addComment() {
    if (this.newComment) {
      this.authService
        .addComment(this.currentUser.id, this.post.id, this.newComment)
        .subscribe(
          () => {
            this.newComment = '';
            this.lazyLoad(this.post.id)
          },
        );
    }
  }

  deleteComment(comment: Comment) {
    if (this.currentUser.id === comment.userId) {
      this.authService.deleteComment(comment.id).subscribe(
        () => {
          this.lazyLoad(this.post.id)
        },
      );
    }
  }

  getTimeComment(comment: Comment) {
    const now = new Date();
    const createdAt = new Date(comment.createdAt);
    const diffMilliseconds = now.getTime() - createdAt.getTime();

    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    if (diffSeconds < 60) {
      return `${diffSeconds} s`;
    }

    const diffMinutes = Math.floor(diffMilliseconds / 1000 / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    }

    const diffHours = Math.floor(diffMilliseconds / 1000 / 60 / 60);
    if (diffHours < 24) {
      return `${diffHours} h`;
    }

    const diffDays = Math.floor(diffMilliseconds / 1000 / 60 / 60 / 24);
    if (diffDays < 30) {
      return `${diffDays} días`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `${diffMonths} sem`;
    }

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} años`;
  }

  isLiked(): boolean {
    if (this.currentUser) {
      return this.post.likes.includes(this.currentUser.id);
    }
    return false;
  }

  likePost(): void {
    if (this.isLiked()) {
      const index = this.post.likes.indexOf(this.currentUser.id);
      if (index > -1) {
        this.post.likes.splice(index, 1);
      }
      this.authService.unlike(this.post.id, this.currentUser.id).subscribe(
        () => {
        },
      );
    } else {
      this.post.likes.push(this.currentUser.id);

      this.authService.like(this.post.id, this.currentUser.id).subscribe(
        () => {
        },
      );
    }
  }

  goToProfile(id: string): void {
    this.router.navigate([id, 'profile'])
  }
}
