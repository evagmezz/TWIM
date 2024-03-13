import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { OnModuleInit } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Server, Socket } from 'socket.io'
import { AuthService } from '../../rest/auth/services/ auth.service'
import { UserMapper } from '../../rest/user/mapper/user-mapper'

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly userMapper: UserMapper,
  ) {}

  onModuleInit() {
    this.server.on('connect', async (socket: Socket) => {
      const { username, token } = socket.handshake.auth
      if (!username || !token) {
        socket.disconnect()
        return
      }

      const responseUserDto = await this.authService.validateUser(token)
      if (!responseUserDto || responseUserDto.username !== username) {
        socket.disconnect()
        return
      }

      const user = this.userMapper.toUser(responseUserDto)

      this.server.emit('on-client-changed', this.chatService.getUsers())

      this.chatService.onUserConnect(user)
      socket.on('disconnect', () => {
        this.server.emit('on-client-changed', this.chatService.getUsers())
        this.chatService.onUserDisconnect(socket.id)
        console.log('Usuario desconectado: ', socket)
      })
    })
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const username = client.handshake.auth

    if (!message) {
      return
    }
    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      username: username,
    })
  }
}
