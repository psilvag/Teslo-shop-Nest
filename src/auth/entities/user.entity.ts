import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid') // si no se coloca uuid es autoincrementable
    id:string

    @Column('text',{
        unique:true
    })
    email:string

    @Column('text')
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
}
