import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { Post } from '../index/index.component'

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

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials)
  }

  register(credentials: {
    name: string
    lastname: string
    username: string
    password: string
    email: string
    repeatPwd: string
    photo: string
  }): Observable<any> {
    return this.http.post(this.registerUrl, credentials)
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
}
