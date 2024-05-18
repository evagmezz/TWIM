import {User} from "./user";
import {Comment} from "./comment";

export class Post {
  user: User
  title: string
  photos: string[]
  location: string
  createdAt: string
  updatedAt: string
  comments: Comment[]
  id: string
  likes: string[]
}
