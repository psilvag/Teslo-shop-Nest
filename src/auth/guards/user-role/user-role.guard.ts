import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';
import { META_ROLES } from '../../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //Reflector ayuda a ver informacion de la metadata del metodo 
   constructor(
    private readonly reflector:Reflector
   ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    // obtenemos validRoles de SetMetadata
    const validRoles:string[]=this.reflector.get(META_ROLES,context.getHandler())
    const req=context.switchToHttp().getRequest()
    const user=req.user as User
    

    // si validRoles no existe es porque no se esta haciendo aqui la autenticacion o si no hay roles es porque no se establecieron o no hay entonces deberia dejarlo pasar igualemente
    if(!validRoles || validRoles.length==0 ) return true
        
    if(!user){
       throw new BadRequestException('User not found')
    }
    // si alguno de los roles del usuario estan dentro de lo establecido entonces deja pasar
    for(const role of user.roles){
     if(validRoles.includes(role)){
      return true
     }
    }
     throw new ForbiddenException(
      `User ${user.fullName} need a valid role:[${validRoles}]`
     )



  
  }
}
