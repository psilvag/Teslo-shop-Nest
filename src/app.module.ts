import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    //forRoot: Configuracion para el manejo de variables de entorno
    ConfigModule.forRoot(),
        
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:  process.env.DB_HOST ,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // va creando las entidades automaticamente
      synchronize: true, //cualquier cambio en las entidades las sincroniza, false en prod
    }),
        
    ProductsModule,
  ],
})
export class AppModule {}
