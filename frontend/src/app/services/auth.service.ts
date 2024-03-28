import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Comment, Post, User } from '../index/index.component';

export class Paginate<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:3000/auth';
  private postUrl = 'http://localhost:3000/post';
  private commentUrl = 'http://localhost:3000/comment';
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/signin`, credentials);
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, formData);
  }

  index(): Observable<Paginate<Post>> {
    return this.http.get<Paginate<Post>>(this.postUrl).pipe(
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
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }

  details(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postUrl}/${id}`);
  }

  addComment(userId: string, postId: string, content: string): Observable<any> {
    return this.http.post(this.commentUrl, {
      userId,
      postId,
      content,
    });
  }

  follow(userId: string, userToFollowId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/follow`, { userId, userToFollowId });
  }

  unfollow(userId: string, userToUnfollowId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/unfollow`, { userId, userToUnfollowId });
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.postUrl}/${postId}/comments`);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/me/profile`);
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.commentUrl}/${commentId}`);
  }

  like(postId: string, userId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/like`, { postId, userId });
  }

  unlike(postId: string, userId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/unlike`, { postId, userId });
  }

  getFollowing(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/${userId}/following`);
  }

  getUserPosts(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postUrl}/user/${userId}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getPostsLikedByUser(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postUrl}/user/${userId}/liked`);
  }

  updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.usersUrl}/me/profile`, formData);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.usersUrl}/me/profile`);
  }

  checkUser(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.usersUrl}/check`, { username, password });
  }
}
