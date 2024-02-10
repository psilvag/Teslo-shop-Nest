import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';


interface ConnectedClients{
   //    id   :value
   [id:string]:Socket 
}

@Injectable()
export class MessagesWsService {
      // creamos esta propiedad para manejar a todos nuestros clientes conectados
     private connectedClients:ConnectedClients={}
     
     // registrar los clientes conectados
     registerClient(client:Socket){
        this.connectedClients[client.id]=client
        
     }

     removeClient(clientId:string){
        delete this.connectedClients[clientId]
     }
    // este metodo es para retornar la cantidad de usuarios conectados
     getConnectedClient():string[]{
        return  Object.keys(this.connectedClients) 
     }


}
