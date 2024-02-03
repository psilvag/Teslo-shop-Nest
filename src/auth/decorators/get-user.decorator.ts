import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


 
 export const GetUser=createParamDecorator(
    (data:string,ctx:ExecutionContext)=>{
        //obtenemos el usuario
        // data seria el email que es enviado enviado en el decorador
     const req=ctx.switchToHttp().getRequest()
     const user=req.user
     if(!user){
        throw new InternalServerErrorException('User not found in the dataBase')
     }
     return !data ? user: user[data]
    }

 )

 
 

