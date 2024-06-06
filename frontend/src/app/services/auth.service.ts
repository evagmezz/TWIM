import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { Post } from '../models/post';
import { User } from '../models/user';
import { PaginateMongo } from '../models/paginateMongo';
import {PaginatePostgre} from "../models/paginatePostgre";

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

  signout(): void {
    localStorage.removeItem('access_token')
  }

  isAdmin() {
    const token = localStorage.getItem('access_token');
    if(!token) {
      return false;
    }
    const payload=  JSON.parse(atob(token.split('.')[1]));
    return Boolean(payload.isAdmin);
  }

  index(page: number, limit: number): Observable<PaginateMongo<Post>> {
    return this.http.get<PaginateMongo<Post>>(`${this.postUrl}?page=${page}&limit=${limit}`).pipe(
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
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }

  details(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postUrl}/${id}`);
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.postUrl}/${postId}/comments`);
  }

  addComment(userId: string, postId: string, content: string): Observable<any> {
    return this.http.post(this.commentUrl, {
      userId,
      postId,
      content,
    });
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.commentUrl}/${commentId}`);
  }

  follow(userId: string, userToFollowId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/follow`, { userId, userToFollowId });
  }

  unfollow(userId: string, userToUnfollowId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/unfollow`, { userId, userToUnfollowId });
  }

  like(postId: string, userId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/like`, { postId, userId });
  }

  unlike(postId: string, userId: string): Observable<any> {
    return this.http.post(`${this.usersUrl}/unlike`, { postId, userId });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/me/profile`);
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

  getUsersPaginate(): Observable<PaginatePostgre<User>> {
  return this.http.get<PaginatePostgre<User>>(`${this.usersUrl}`)
}

  checkUser(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.usersUrl}/check`, { username, password });
  }

  createUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.usersUrl}`, formData);
  }

  updateUser(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.usersUrl}/${userId}`, { role });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${userId}`);
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

  createPost(formData: FormData): Observable<any> {
    return this.http.post(`${this.postUrl}`, formData);
  }

  updatePost(postId: string, title: string, location: string): Observable<any> {
    return this.http.put(`${this.postUrl}/${postId}`, { title, location});
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.postUrl}/${postId}`);
  }

  searchBy(data: string): Observable<any> {
    return this.http.get(`${this.usersUrl}?search=${data}`);
  }
}
