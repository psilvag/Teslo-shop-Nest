import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


interface ConnectedClients{
   //    id   :value
   [id:string]:{
      socket:Socket,
      user:User
   }
}

@Injectable()
export class MessagesWsService {
      // creamos esta propiedad para manejar a todos nuestros clientes conectados
     private connectedClients:ConnectedClients={}
     constructor(
      @InjectRepository(User)
      private readonly userRepository:Repository<User>
     ){}
     
     // registrar los clientes conectados
     async registerClient(client:Socket,userId:string){
       
        const user=await  this.userRepository.findOneBy({id:userId})
        if(!user) throw new Error('User not found')
        if(!user.isActive) throw new Error('User is not active')
        this.checkUserConnection(user)
        this.connectedClients[client.id]={
         socket:client,
         user,
        }
     }

     removeClient(clientId:string){
        delete this.connectedClients[clientId]
     }


    // este metodo es para retornar la cantidad de usuarios conectados
     getConnectedClient():string[]{
        return  Object.keys(this.connectedClients) 
     }
     
     getUserFullNameBySocketId(socketId:string){
      return this.connectedClients[socketId].user.fullName
    }


    // remover usuarios duplicados

    private checkUserConnection(user:User){
      // recorremos todos los ids de sockets registrados 
         for(const clientId of Object.keys(this.connectedClients)){

            // Si el id del usuario ya esta  en el registro de conectados lo desconectamos
            if(this.connectedClients[clientId].user.id===user.id){
               this.connectedClients[clientId].socket.disconnect()
               break
            }
         }
    }

}
