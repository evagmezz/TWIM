import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../index/index.component';
import { FileUploadModule } from 'primeng/fileupload';
import { debounceTime, Subject } from 'rxjs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgIf,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PaginatorModule,
    PasswordModule,
    ReactiveFormsModule,
    NgStyle,
    FileUploadModule,
    NgForOf,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {

  visibleCreate:  boolean = false
  searchSubject = new Subject<string>();
  currentUser: User
  image: File[] = []
  searchResults: User[] = [];
  visibleSearch: boolean = false;

  createPostForm = this.fb.group({
    title: ['', [Validators.required]],
    image: this.fb.array([], [Validators.required, Validators.maxLength(7)]),
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.shouldShowFooter()) {
      this.lazyLoad()
    }
    this.searchSubject.pipe(debounceTime(100)).subscribe(searchValue => {
      this.search(searchValue);
    });
    }

  lazyLoad() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })
  }

 onFileChange(event: any): void {
    console.log(event)
    if (event.currentFiles.length > 0) {
      this.image = event.currentFiles
    }
  }

  openChat(): void {
    this.router.navigate(['/chat']);
  }

  createPost(): void {
    const userId = this.currentUser.id
    const title = this.createPostForm.controls.title.value as string
    const image = this.image
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('title', title)
    for (let i = 0; i < image.length; i++) {
      formData.append('image', image[i])
    }

    this.authService.createPost(formData).subscribe(() => {
      this.visibleCreate = false
      this.router.navigate([`${userId}/profile`])
    })
  }

  shouldShowFooter(): boolean {
    const url = this.router.url
    return url !== '/login' && url !== '/register'
  }

  goToMyProfile(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.router.navigate([`${user.id}/profile`])
    })
  }

  goToIndex(): void {
    this.router.navigate(['index'])
  }

  search(username: string): void {
    this.authService.searchByUsername(username).subscribe(results => {
      if (Array.isArray(results.data)) {
        this.searchResults = results.data;
      } else {
        this.searchResults = [];
      }
    });
  }

  goProfile(id: string): void {
    this.router.navigate([id, 'profile'])
    this.visibleSearch = false
  }
}
