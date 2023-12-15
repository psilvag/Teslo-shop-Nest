import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  
@PrimaryGeneratedColumn('uuid')
id:number

@Column('text',{
    unique:true
})
title:string

@Column('float',{// number no es soportado por postgres, solo numeric
    default:0
})
price:number

// otra manera de especificar lso tipos en typeORM
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

//tags
//images
@Column('text')
gender:string
}


