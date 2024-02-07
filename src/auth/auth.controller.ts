import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles.interface';


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto:CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
   return this.authService.login(loginUserDto)
  }

  //Este endpoint revalida el token generando un nuevo token enb base al otro
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user :User){
    return this.authService.checkAuth(user)
   }

  @Get('private')
  @UseGuards(AuthGuard())   // los guards permiten o previenen el acceso a una ruta
  // aqui podemos obtener el usuario con el decorador @Req() de express y quedaria asi:
  //testingPrivateRoute(@Req() req:Express.Request) 
  // pero: el req traerá un monton de informacion y solo quiero el usuario para ello realizo un CUSTOM DECORATOR 
  // RawHeaders contiene un array de los headers , tambien es un custom decorator propio, pero nest tambien tiene un decorator propio este es: @Headers () header:IncomingHttpHeaders 
  testingPrivateRoute(
    @GetUser() user:User,
    @GetUser('email') userEmail:string, 
    @RawHeaders() rawHeaders:string[]){ // rawheaders lo hacemos para ver la info del request

    return {
      ok:true,
      user,
      userEmail,
      rawHeaders,
    }
  }
  
  @Get('private2')
  //Metadata : sirve para añadir informacion extra al metodo o controlador que quiero ejecutar
  //Nuestro custom decorator vera esta metadata y en funcion al usuario y sus roles dara permisos

  //@SetMetadata('roles',['admin','super-user'])
  @RoleProtected(ValidRoles.superUser,ValidRoles.user) // Valid roles viene de nuestra interface

  //si son guards personalizados usualmente no usamos los parentesis es decir queda UserRoleGuard
  @UseGuards(AuthGuard(),UserRoleGuard) 
  privateRoute2( @GetUser() user:User){
    return {
      ok:true,
      user,
    }
  }

  // usaremos composicion de decoradores, cuando queremos componer un DECORADOR basado en otros deocoradores, en vez de colocar @RoleProtected, @UseGuard etc lo pondremos todo en uno

  @Get('private3')
  @Auth(ValidRoles.admin,ValidRoles.superUser)// Auth seria el decorador final
  privateRoute3(@GetUser() user:User){
    return {
      ok:true,
      user,
    }

  }


}
