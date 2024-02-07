import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid') // si no se coloca uuid es autoincrementable
    id:string

    @Column('text',{
        unique:true
    })
    email:string

    @Column('text',{
        select:false    // con select false, evitamos que retorne la columna del password 
    })
    password:string

    @Column('text')
    fullName:string

    @Column('bool',{ // Postgres reconoce bool no boolean
        default:true
    })  
    isActive:boolean

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
