import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  //CONFIGURACION DEL PREFIX PRINCIPAL
  app.setGlobalPrefix('api')

  const logger= new Logger('Teslo shop App')
  
  //CONFIGURACION GLOBAL-PIPES
  app.useGlobalPipes(
    new ValidationPipe({
     whitelist:true,
     forbidNonWhitelisted:true
    }))
  
  //CONFIGURACION SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Teslo Restful API')
    .setDescription('Teslo Shop EndPoints')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);   

  //PUERTO DE LA APP
  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`)
}
bootstrap();
