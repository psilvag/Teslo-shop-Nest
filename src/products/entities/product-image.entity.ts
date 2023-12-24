import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';


@Entity({name:'products_images'})
export class ProductImage{

@PrimaryGeneratedColumn() 
id:number

@Column('text')
url:string 

@ManyToOne(
    ()=>Product,
    product => product.images,
    {onDelete:'CASCADE'} // CONFIGURAMOS CASCADE, CUANDO EL PRODUCTO SE ELIMINA SE ELIMINARA SUS IMAGENES
)
product:Product

}