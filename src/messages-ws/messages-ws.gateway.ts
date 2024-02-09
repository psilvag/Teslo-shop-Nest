import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

//Los GateWays son como los controladores
@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection,OnGatewayDisconnect {
  constructor(
    private readonly messagesWsService: MessagesWsService
    ) {}


  handleConnection(client:Socket, ...args: any[]) {
    console.log('Cliente conectado',client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado',client.id);
  }
}
