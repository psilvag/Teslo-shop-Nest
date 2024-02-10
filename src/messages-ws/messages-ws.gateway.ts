import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server,Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

//Los GateWays son como los controladores
@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection,OnGatewayDisconnect {
  
  // WebSocketServer tiene la info de todos los clientes conectados
  // wss es un nombre que pusimos para el manejo de este decorador
  @WebSocketServer() wss:Server
  constructor(
    private readonly messagesWsService: MessagesWsService
    ) {}


  handleConnection(client:Socket, ...args: any[]) {
  this.messagesWsService.registerClient(client)
  this.wss.emit('clients-updated',this.messagesWsService.getConnectedClient())

  }
  handleDisconnect(client: Socket) {
   this.messagesWsService.removeClient(client.id)
   this.wss.emit('clients-updated',this.messagesWsService.getConnectedClient())
  }

  
}
