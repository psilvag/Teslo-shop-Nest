import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product,ProductImage } from './entities';
import { PaginationDTO } from '../common/DTOS/pagination.dto';
import {validate as isUUID} from 'uuid'  //uuid tiene una funcion para validar un uuid


@Injectable()
export class ProductsService {
  // Creamos una instancia de Logger para manejar los errores
  private readonly logger= new Logger('ProductsService')
  // usando el patron repositorio para manejar el entity product
  constructor(
    @InjectRepository(Product) // Inyectamos nuestra entity
    private readonly productRepository:Repository<Product>, //es de tipo repository  
    @InjectRepository(ProductImage)
    private readonly productImageRepository:Repository<ProductImage>
  ){}


  async create(createProductDto: CreateProductDto) {
    
    try{
      const {images=[],...productDetails}=createProductDto
      // aqui solo estamos creando una instancia del producto 
      const product= this.productRepository.create({
        ...productDetails,
        images:images.map(url=>this.productImageRepository.create({url}))
      })
      // aqui guardamos en la base de datos
      await this.productRepository.save(product)
      return {...product,images,}
     }catch(error){
      this.handleExceptions(error)
    }
  }



  async findAll(paginationDTO:PaginationDTO){
    
    //  si no viene limit toma 10 y offset=0
    const {limit=10, offset=0}=paginationDTO
    const products= await this.productRepository.find({
      take:limit,
      skip:offset,
      relations:{ // el  nombre "images" de esta relacion, viene de nuestra entity product -"images"- la cual es una RELACION, no UNA COLUMNA 
        images:true
       }     
    })
    return products.map(product=>({
      ...product,
      images:product.images.map(image=>image.url) // estamos solo devolviendo un array de urls de imagenes
    }))
  }    
  


  async findOne( term: string) {
    let product:Product
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:term})
    }else{

      // las query Builder son funciones que nos ayudan a crear querys mas robustas
      // si queremos buscar por titulo en las querys , con la query builder evitamos que se escriba mal o se haga SQL inyection
      const queryBuilder=this.productRepository.createQueryBuilder('prod')// es un alias para las relaciones
      product= await queryBuilder
      .where('UPPER(title) =:title or slug=:slug',{
        title:term.toUpperCase().trimEnd(),
        slug:term.toLowerCase().trimEnd(),
      })//usamos .leftJoinAndSelect porque no estamos buscando por find asi que la relacion ya no funcionaria 
      .leftJoinAndSelect('prod.images','prodImages')// prod.images:donde se hace la relacion, prodImages:si queremos hacer otro join con estas imagenes
      .getOne() // getOne() solo quiero uno o el titulo o el slug
    }
    
    if(!product){
      throw new BadRequestException(`Product with ${term} NOT Found`)
    }
    return product
  }
 // esta funcion sirve para no modificar 
 async findOnePlain(term:string){
  const {images=[], ...rest}=await this.findOne(term)
  return {
    ...rest,
    images: images.map(image=>image.url)
  }
 }


 async update(id: string, updateProductDto: UpdateProductDto) {
  // buscamos el producto por id y lo preparamos para la actualizacion

  const product =await this.productRepository.preload({
    id:id,
    ...updateProductDto,
    images:[]
  })
  if(!product){
    throw new NotFoundException(`Product with ID "${id}" not found`);
  }
  try{
    await this.productRepository.save(product)
  }catch(error){
    this.handleExceptions(error)
  }
  
  return product
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
