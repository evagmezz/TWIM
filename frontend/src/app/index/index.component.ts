import {Component, OnInit} from '@angular/core'
import {Router, RouterOutlet} from '@angular/router'
import {AuthService} from '../services/auth.service'
import {AsyncPipe, NgClass} from '@angular/common';
import {CardModule} from 'primeng/card'
import {RatingModule} from 'primeng/rating'
import {TagModule} from 'primeng/tag'
import {ButtonModule} from 'primeng/button'
import {FormsModule} from '@angular/forms'
import {DataViewModule} from 'primeng/dataview'
import {DialogModule} from 'primeng/dialog'
import {HostListener} from '@angular/core'
import {User} from "../models/user"
import {Post} from "../models/post"
import {SidebarModule} from "primeng/sidebar"
import {PaginateMongo} from "../models/paginateMongo"
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterOutlet, CardModule, AsyncPipe, DataViewModule, RatingModule, TagModule, ButtonModule, NgClass, FormsModule, DataViewModule, DialogModule, SidebarModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {


  posts: Post[] = []
  users: User[]
  currentUser: User
  post: Post
  visibleAddComment: boolean = false
  currentPage = 1
  pageSize = 10
  totalPages = 1
  isLoadingPosts = false
  totalRecords: number = 0

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
    this.router.navigate(['details', id])
  }

  lazyLoad() {
    this.authService.getUsers().subscribe((data) => {
      this.users = data
    })
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })
    this.loadPosts()
  }

  loadPosts(): void {
    if (this.currentPage <= this.totalPages && !this.isLoadingPosts) {
      this.isLoadingPosts = true
      this.authService.index(this.currentPage, this.pageSize).subscribe((data: PaginateMongo<Post>) => {
        this.posts = [...this.posts, ...data.docs]
        this.totalRecords = data.totalDocs
        this.totalPages = data.totalPages
        this.currentPage++
        this.isLoadingPosts = false
      })
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight
    let max = document.documentElement.scrollHeight
    if (pos >= max) {
      this.loadPosts()
    }
  }

  goToProfile(id: string): void {
    this.router.navigate([id, 'profile'])
  }

  isLiked(post: Post): boolean {
    if (this.currentUser) {
      return post.likes.includes(this.currentUser.id)
    }
    return false
  }

  likePost(post: Post): void {
    if (this.isLiked(post)) {
      const index = post.likes.indexOf(this.currentUser.id)
      if (index > -1) {
        post.likes.splice(index, 1)
      }
      this.authService.unlike(post.id, this.currentUser.id).subscribe()
    } else {
      post.likes.push(this.currentUser.id)
      this.authService.like(post.id, this.currentUser.id).subscribe()
    }
  }
}
