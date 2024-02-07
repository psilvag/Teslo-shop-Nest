import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product,ProductImage } from './entities';
import { PaginationDTO } from '../common/DTOS/pagination.dto';
import {validate as isUUID} from 'uuid'  //uuid tiene una funcion para validar un uuid
import { User } from '../auth/entities/user.entity';


@Injectable()
export class ProductsService {
  // Creamos una instancia de Logger para manejar los errores
  private readonly logger= new Logger('ProductsService')
  // usando el patron repositorio para manejar el entity product
  constructor(
    @InjectRepository(Product) // Inyectamos nuestra entity
    private readonly productRepository:Repository<Product>, //es de tipo repository  
    @InjectRepository(ProductImage)
    private readonly productImageRepository:Repository<ProductImage>,
    private readonly dataSource:DataSource
  ){}


  async create(createProductDto: CreateProductDto, user:User) {
    
    try{
      const {images=[],...productDetails}=createProductDto
      // aqui solo estamos creando una instancia del producto 
      const product= this.productRepository.create({
        ...productDetails,
        images:images.map(url=>this.productImageRepository.create({url})),
        user,

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
  


  async findOne( term: string) {//podemos buscar el producto por ID, titulo o slug
    let product:Product
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:term})
    }else{

      // las query Builder son funciones que nos ayudan a crear querys mas robustas
      // si queremos buscar por titulo en las querys , con la query builder evitamos que se escriba mal o se haga SQL inyection
       // -------USAMOS QUERY BUILDER------------
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



 // esta funcion sirve para no modificar el estado en el que se devuelve el producto
 async findOnePlain(term:string){
  const {images=[], ...rest}=await this.findOne(term)
  return {
    ...rest,
    images: images.map(image=>image.url)
  }
 }


 async update(id: string, updateProductDto: UpdateProductDto, user:User) {
  // buscamos el producto por id y lo preparamos para la actualizacion
  const {images,...toUpdate}=updateProductDto
  const product =await this.productRepository.preload({id,...toUpdate})

  if(!product){
    throw new NotFoundException(`Product with ID "${id}" not found`);
  }
  
  //Transacciones: permite ejecutar varias querys SQL y si todo esta bien lo impacta sobre la DB sino se puede revertir:
  // -------USAMOS QUERY RUNNER------------
  // dataSource importamos de typeOrm contiene toda la informacion de la DB,como conexion, relaciones etc.
  const queryRunner=this.dataSource.createQueryRunner()// el queryRunner no cambia nada en la DB hasta ejecutar un commit
  await queryRunner.connect()
  await queryRunner.startTransaction()
  try{
    // si hay imagenes nuevas en el update
    if(images){
      // elimina las imagenes que estan presentes
       await queryRunner.manager.delete(ProductImage,{product:{id}})
       // creamos una instancia nueva para cada imagen
       product.images=images.map(
        image=>this.productImageRepository.create({url:image}))
        
    }
    product.user=user 
    await queryRunner.manager.save(product)
    

    // APLICAMOS EL COMMIT SI TODO ESTA BIEN
    await queryRunner.commitTransaction()
    // Finalizamos el query Runner si deseamos usarlo de nuevo, debemos volver a conectarnos
    await queryRunner.release()
    // si no vienen imagenes retornamos las imagenes actuales que estan en el producto
    return this.findOnePlain(id)

  }catch(error){
    await queryRunner.rollbackTransaction()
    await queryRunner.release()
    this.handleExceptions(error)
  }
  
 
  }


  async remove(id: string) {
    const product = await this.findOne(id)
    await  this.productRepository.remove(product)
  }

 
// Esta parte es para borrar toda la tabla de PRODUCTOS, crearemos un seed de productos para manejarlo en desarrollo y este metodo sirve para eliminar todo y volver a ejecutar el seed

async deleteAllProducts() {
  const query= this.productRepository.createQueryBuilder()
  try{
    return await query
    .delete()
    .where({}) // ({}) estamos diciendo borrar todo
    .execute()
  }catch(error){
    this.handleExceptions(error)
  }
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
