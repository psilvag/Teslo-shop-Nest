import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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

//images

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
}

