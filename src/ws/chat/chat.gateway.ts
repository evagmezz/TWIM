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

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connect', (socket: Socket) => {
      const { name, token } = socket.handshake.auth
      if (!name || !token) {
        socket.disconnect()
        return
      }

      this.server.emit('on-client-changed', this.chatService.getClients())

      this.chatService.onClientConnect({ id: socket.id, name: name })
      socket.on('disconnect', () => {
        this.server.emit('on-client-changed', this.chatService.getClients())
        this.chatService.onClientDisconnect(socket.id)
        console.log('Cliente desconectado: ', socket)
      })
    })
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const name = client.handshake.auth

    if (!message) {
      return
    }
    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
    })
  }
}
