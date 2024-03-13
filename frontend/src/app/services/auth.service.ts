import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/auth/signin'
  private registerUrl = 'http://localhost:3000/auth/signup'

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
  }): Observable<any> {
    return this.http.post(this.registerUrl, credentials)
  }
}
