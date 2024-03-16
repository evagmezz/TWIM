import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/auth/signin'
  private registerUrl = 'http://localhost:3000/auth/signup'
  private indexUrl = 'http://localhost:3000/post'
  private tokenKey = 'token'

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
  }): Observable<any> {
    return this.http.post(this.registerUrl, credentials)
  }

  index(): Observable<any> {
    return this.http.get(this.indexUrl)
  }
}
