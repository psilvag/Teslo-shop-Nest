import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  // usando el patron repositorio para manejar el entity product
  constructor(
    @InjectRepository(Product) // Inyectamos nuestra entity
    private readonly productRepository:Repository<Product> //es de tipo repository  
  ){}

  async create(createProductDto: CreateProductDto) {
    
    try{
      // aqui solo estamos creando una instancia del producto 
      const product= this.productRepository.create(createProductDto)
      // aqui guardamos en la base de datos
      await this.productRepository.save(product)
      return product
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Ayuda')
    }
 

  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
