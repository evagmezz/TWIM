import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { Post, User, Comment } from '../index/index.component'

export class Paginate<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number
  nextPage: number
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/auth/signin'
  private registerUrl = 'http://localhost:3000/auth/signup'
  private indexUrl = 'http://localhost:3000/post'
  private porfileUrl = 'http://localhost:3000/users/me/porfile'

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials)
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(this.registerUrl, formData)
  }

  index(): Observable<Paginate<Post>> {
    return this.http.get<Paginate<Post>>(this.indexUrl).pipe(
      map((res) => ({
        docs: res.docs,
        totalDocs: res.totalDocs,
        limit: res.limit,
        totalPages: res.totalPages,
        page: res.page,
        pagingCounter: res.pagingCounter,
        hasPrevPage: res.hasPrevPage,
        hasNextPage: res.hasNextPage,
        prevPage: res.prevPage,
        nextPage: res.nextPage,
      })),
    )
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users/${id}`)
  }

  details(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.indexUrl}/${id}`)
  }

  addComment(userId: string, postId: string, content: string): Observable<any> {
    return this.http.post('http://localhost:3000/comment', {
      userId,
      postId,
      content,
    })
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.indexUrl}/${postId}/comments`)
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.porfileUrl)
  }
}
