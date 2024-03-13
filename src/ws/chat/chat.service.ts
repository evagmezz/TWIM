import { Injectable } from '@nestjs/common'
import { User } from '../../rest/user/entities/user.entity'

@Injectable()
export class ChatService {
  private users: Record<string, User> = {}

  onUserConnect(user: User) {
    this.users[user.id] = user
  }

  onUserDisconnect(userId: string) {
    delete this.users[userId]
  }

  getUsers() {
    return Object.values(this.users)
  }
}
