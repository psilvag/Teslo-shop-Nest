import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  const logger= new Logger('Teslo shop App')
  app.useGlobalPipes(
    new ValidationPipe({
     whitelist:true,
     forbidNonWhitelisted:true
    }))
    
  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`)
}
bootstrap();
