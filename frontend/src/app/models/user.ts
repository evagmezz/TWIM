import {Role} from "./roles";

export class User {
  id: string
  name: string
  lastname: string
  username: string
  password: string
  email: string
  image: string
  role: Role['name']
  createdAt: string
  updatedAt: string
  followers: User[]
}
