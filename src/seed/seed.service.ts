import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {
 constructor(
  private readonly productsService:ProductsService
 ){}
 
  async runSeed(){
     
    await this.insertNewProducts()
    return 'SEED EXECUTED SUCCESSFULLY!'
   
    
   }

   private async insertNewProducts(){
    // Borramos los datos
     await this.productsService.deleteAllProducts()

    // Insertamos datos
    const seedProducts= initialData.products
    const insertPromises=[]
    seedProducts.forEach(product=>{
      insertPromises.push(this.productsService.create(product))
    })
    await Promise.all(insertPromises)
    return true
   }
}
