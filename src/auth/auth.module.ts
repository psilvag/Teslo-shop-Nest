import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy:'jwt'}),

    // Debido a que la llave secreta JWTSECRET no puede estar definida al momento de cargar la app, usamos el modulo asincrono para asegurarnos su carga
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>{
        return {
        secret:configService.get('JWTSECRET'),
        signOptions:{
        expiresIn:'2h'
        
      }}
    }

      
    })
    // ESTO SERIA DE FORMA SINCRONA 
    // JwtModule.register({
    //   secret:process.env.JWTSECRET,
    //   signOptions:{
    //     expiresIn:'2h'
    //   }
    // })

  ],
  exports:[TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
