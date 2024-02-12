import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';


@Entity()
export class User {

    @ApiProperty({
        example:'cd333409-f3f4-56c9-a3d4-7dc3dt80c5f5',
        description:'User id',
        uniqueItems:true
    }) 
    @PrimaryGeneratedColumn('uuid') // si no se coloca uuid es autoincrementable
    id:string
    
    @ApiProperty({
        example:'example@example.com',
        description:'Email user',
        uniqueItems:true
    }) 
    @Column('text',{
        unique:true
    })
    email:string

    @ApiProperty({
        description:'Password user',
        example:'****passwordUser****',
        minLength:6,
        maxLength:50
    }) 
    @Column('text',{
        select:false    // con select false, evitamos que retorne la columna del password 
    })
    password:string


    @ApiProperty({
        example:'Names and Last names',
        description:'Full name user',
        minLength:1
    }) 
    @Column('text')
    fullName:string
  
    @ApiProperty({
        example:'True-False',
        description:'User isActive ?',
        default:true
    }) 
    @Column('bool',{ // Postgres reconoce bool no boolean
        default:true
    })  
    isActive:boolean


    @ApiProperty({
        example:'Admin,super-user, user',
        description:'Roles user',
        type:"String array",
        default:["user"]
    }) 
    @Column('text',{
        array:true,
        default:['user']
     })
    roles:string[]

    // RELACION UNO A MUCHOS CON LA TABLA PRODUCTO  ONE->TO->MANY
    // UN USUARIO PUEDE CREAR MUCHOS PRODUCTOS
    @OneToMany(
        ()=>Product,
        (product)=>product.user
    )
    product:Product  


    
    @BeforeInsert()
    checkFieldBeforeInsert(){
        this.email=this.email.toLowerCase().trim()
    }
    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldBeforeInsert()
    }

}
