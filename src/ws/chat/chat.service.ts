import { Injectable } from '@nestjs/common'
interface Client {
  id: string
  name: string
}

@Injectable()
export class ChatService {
  private clients: Record<string, Client> = {}

  onClientConnect(client: Client) {
    this.clients[client.id] = client
  }

  onClientDisconnect(clientId: string) {
    delete this.clients[clientId]
  }

  getClients() {
    return Object.values(this.clients)
  }
}
