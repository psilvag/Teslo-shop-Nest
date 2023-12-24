import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product,ProductImage } from './entities';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    // Importamos nuestras entitys en el array de forFeature
    TypeOrmModule.forFeature([Product,ProductImage])
  ],
  exports:[ProductsService,TypeOrmModule] //TypeOrmModule lo importamos para usar los repositorios de ese modulo
})
export class ProductsModule {}
