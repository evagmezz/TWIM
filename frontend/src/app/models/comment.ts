import {User} from "./user";

export class Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: string
  user: User
}
