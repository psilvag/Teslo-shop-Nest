import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';
import{NewMessageDTO} from './dtos/new-message.dto'
import { ApiTags } from '@nestjs/swagger';


//Los GateWays son como los controladores
@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection,OnGatewayDisconnect {
  
  // WebSocketServer tiene la info de todos los clientes conectados
  // wss es un nombre que pusimos para el manejo de este decorador
  @WebSocketServer() wss:Server
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtservice:JwtService
    ) {}


  async handleConnection(client:Socket) {
    // cuando un cliente se conecta los extraheaders enviados por el front estan en client y obtenemos de alli el token que envio 
  const token= client.handshake.headers.authentication as string
  let payload:JwtPayload
  try{
    payload=this.jwtservice.verify(token)
    await this.messagesWsService.registerClient(client,payload.id)
  }catch(error){
    client.disconnect()  // disconnect() es una funcion propia de client
    return 
  }
  this.wss.emit('clients-updated',this.messagesWsService.getConnectedClient())

  }


  handleDisconnect(client: Socket) {
   this.messagesWsService.removeClient(client.id)
   this.wss.emit('clients-updated',this.messagesWsService.getConnectedClient())
  }
  
  //@SubscribeMessage: son como los metodos POST,GET etc. pero para socket, espero el nombre del evento a escuchar
  //message-from-client: es el nombre del evento que escucha del cliente
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client:Socket,payload:NewMessageDTO){

    // ESTO EMITE SOLO AL CLIENTE QUE ENVIO AL CLIENTE INICIAL
    //client.emit('message-from-server',{fullname:"hola soy yo", message:payload.message || 'no message'})

    // EMITIR A TODOS MENOS AL CLIENTE QUE ENVIO EL MENSAJE INICIAL
    //client.broadcast.emit('message-from-server',{fullname:"hola soy yo", message:payload.message || 'no message'})
    
    // EMITE A TODOS INCLUSO AL CLIENTE QUE ENVIO EL MENSAJE INICIAL
    this.wss.emit('message-from-server',{
      fullname:this.messagesWsService.getUserFullNameBySocketId(client.id), // client.id es el id del socket asignado al usuario conectado
      message:payload.message || 'no message'
    })
  }

 
  
}
