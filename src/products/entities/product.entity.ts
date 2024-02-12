import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';


@Entity({name:'products'})
export class Product {

@ApiProperty({
    example:'cd333409-f3f4-56c9-a3d4-7dc3dt80c5f5',
    description:'Product id',
    uniqueItems:true
})    
@PrimaryGeneratedColumn('uuid')
id:string

@ApiProperty({
    example:'T-Shirt Teslo',
    description:'Product Title',
    uniqueItems:true
})  
@Column('text',{
    unique:true
})
title:string

@ApiProperty({
    example:45.89,
    description:'Product price',
    default:0
   
})  
@Column('float',{// number no es soportado por postgres, solo numeric
    default:0
})
price:number

@ApiProperty({
    example:'Lorem Ipsum color nulla imn anim mollit',
    description:'Product description',
    nullable:true
    
})  
// otra manera de especificar los tipos en typeORM
@Column({
    type:'text',
    nullable:true
})
description:string

@ApiProperty({
    example:'T-shirt Teslo',
    description:'Product Slug',
    uniqueItems:true
})  
@Column('text',{
    unique:true
})
slug:string

@ApiProperty({
    example:10,
    description:'Product stock',
    default:0
})  
@Column('int',{
    default:0
})
stock:number


@ApiProperty({
    example:['X,XL,M'],
    description:'Product sizes',
    type:"array strings"

})  
@Column('text',{
    array:true
})
sizes:string[]


@ApiProperty({
    example:'women',
    description:'Product gender'
    
})  
@Column('text')
gender:string


@ApiProperty({
    example:['sweatshirt'],
    description:'Product tags',
    default:[],
    type:"array strings"
})  
@Column({
    type:'text',
    array:true,
    default:[]
})
tags:string[]



@ApiProperty()  
@OneToMany(
   () => ProductImage,
   (productImage)=>productImage.product,
   {cascade:true,
    eager:true // eager: permite que cuando busquemos por cualquier find automaticamente relaciona y carga la relacion
   }
)
images?:ProductImage[]



// BEFORE INSERT : SIRVE PARA VALIDAR LAS PROPIEDADES ANTES DE INSERTAR
// creamos una funcion para validar SI NO VIENE EL SLUG,ENTONCES LO CREA A PARTIR DEL TITULO
    @BeforeInsert()
    checkSlugInsert(){
    if(!this.slug){
        this.slug=this.title
     }
     this.slug=this.slug
     .toLocaleLowerCase()
     .replaceAll(' ','_')
     .replaceAll("'",'')
    }
    // NOTA: para usar replaceAll() es necesario modificar la version del target  ES20XX a ES2021, para ello dirigirse al archivo tsconfig.json y cambiar la propiedad   "target" a   "target": "ES2021"
    @BeforeUpdate()
    checkSlugUpdate(){
       this.slug=this.slug
       .toLocaleLowerCase()
       .replaceAll("'",'')
       .replaceAll(' ','_')
    }


    // RELACION  MUCHOS A UNO CON LA TABLA USER   MANY-->TO->ONE
    // MUCHOS PRODUCTOS SON CREADOS POR UN USUARIO

    @ManyToOne(
        ()=>User,
        (user)=>user.product,
        {eager:true} // eager sirve para que cargue automaticamente la relacion con el usuario, y cuando se pida algun producto tambien traiga al usuario que lo creo
    )
    user:User

}

