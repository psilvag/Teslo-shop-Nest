import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorators';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';


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

  @Get('private')
  @UseGuards(AuthGuard())   // los guards permiten o previenen el acceso a una ruta
  // aqui podemos obtener el usuario con el decorador @Req() de express y quedaria asi:
  //testingPrivateRoute(@Req() req:Express.Request) 
  // pero: el req traerá un monton de informacion y solo quiero el usuario para ello realizo un CUSTOM DECORATOR 
  // RawHeaders contiene un array de los headers , tambien es un custom decorator propio, pero nest tambien tiene un decorator propio este es: @Headers () header:IncomingHttpHeaders 
  testingPrivateRoute(
    @GetUser() user:User,
    @GetUser('email') userEmail:string, 
    @RawHeaders() rawHeaders:string[]){

    return {
      ok:true,
      user,
      userEmail,
      rawHeaders,
    }
  }
  
  @Get('private2')
  //Metada : sirve para añadir informacion extra al metodo o controlador que quiero ejecutar
  //Nuestro custom decorator vera esta metadata y en funcion al usuario y sus roles dara permisos
  @SetMetadata('roles',['admin','super-user'])
  //si son guards personalizados usualmente no usamos los parentesis es decir queda UserRoleGuard
  @UseGuards(AuthGuard(),UserRoleGuard) 
  privateRoute2( @GetUser() user:User){
    return {
      ok:true,
      user,
    }
  }
}
