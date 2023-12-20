import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDTO } from '../common/DTOS/pagination.dto';


@Injectable()
export class ProductsService {
  // Creamos una instancia de Logger para manejar los errores
  private readonly logger= new Logger('ProductsService')
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
      this.handleExceptions(error)
    }
  }

  findAll(paginationDTO:PaginationDTO){

    //  si no viene limit toma 10 y offset=0
    const {limit=10, offset=0}=paginationDTO
    return this.productRepository.find({
        take:limit,
        skip:offset
    //  relaciones entre las tablas      
  })}
  
  async findOne( id: string) {
    const product = await this.productRepository.findOneBy({id})
    if(!product){
      throw new BadRequestException('Product with ID not found')
    }
    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }
  async remove(id: string) {
    const product = await this.findOne(id)
    await  this.productRepository.remove(product)
  }

  private handleExceptions(error:any){    
    // si hacemos un console.log(error) veremos un objeto que tiene una propiedad code=23505
    if(error.code==='23505'){
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Expect server error, check server logs')
  }

}
