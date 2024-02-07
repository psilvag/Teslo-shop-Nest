import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {
 constructor(
  private readonly productsService:ProductsService,
  @InjectRepository(User)
  private readonly userRepository:Repository<User>
 ){}
 
  async runSeed(){
    await this.deleteTables()
    const adminUser=await this.insertNewUsers()
    await this.insertNewProducts(adminUser)
    return 'SEED EXECUTED SUCCESSFULLY!'
  }

   private async deleteTables(){
    await this.productsService.deleteAllProducts() // primero borramos los productos para que permita borrar a usuarios
    // Con esta query builder borramos a todos los usuarios
    const queryBuilder=this.userRepository.createQueryBuilder()
    queryBuilder
    .delete()
    .where({})
    .execute()
   }


   private async insertNewUsers(){
    // OTRA FORMA DE INSERTAR DATOS
     // Insertamos nuevos usuarios
     const seedUsers=initialData.users
     const users:User[]=[]
     seedUsers.forEach(user=>{
      users.push(this.userRepository.create(user)) // creando instancias de cada user
     })
     const dbUsers=await this.userRepository.save(seedUsers)
     //return users[0]-----> esto no funcionaria porque estaria retornando el primer usuario pero sin ID debido a que solo es la instancia del primer user y aun no esta guardado, por eso usamos dbUsers para guardarlo en la base de datos  y recien devuelve el user con el ID
     return dbUsers[0] // retornamos el primer usuario, el usuario admin
   }


   private async insertNewProducts(adminUser:User){
    // Borramos los datos
     await this.productsService.deleteAllProducts()

    // Insertamos datos
    const seedProducts= initialData.products
    const insertPromises=[]
    seedProducts.forEach(product=>{
      insertPromises.push(this.productsService.create(product,adminUser))
    })
    await Promise.all(insertPromises)
    return true
   }
}
