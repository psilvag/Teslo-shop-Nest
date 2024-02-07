import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({name:'products'})
export class Product {
  
@PrimaryGeneratedColumn('uuid')
id:string

@Column('text',{
    unique:true
})
title:string

@Column('float',{// number no es soportado por postgres, solo numeric
    default:0
})
price:number

// otra manera de especificar los tipos en typeORM
@Column({
    type:'text',
    nullable:true
})
description:string

@Column('text',{
    unique:true
})
slug:string

@Column('int',{
    default:0
})
stock:number

@Column('text',{
    array:true
})
sizes:string[]

@Column({
    type:'text',
    array:true,
    default:[]
})
tags:string[]



@OneToMany(
   () => ProductImage,
   (productImage)=>productImage.product,
   {cascade:true,
    eager:true // eager: permite que cuando busquemos por cualquier find automaticamente relaciona y carga la relacion
   }
)
images?:ProductImage[]

@Column('text')
gender:string


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

