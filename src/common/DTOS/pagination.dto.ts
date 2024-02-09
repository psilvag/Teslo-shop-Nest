import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"


export class PaginationDTO{

    @ApiProperty({
        default:10, 
        description:'How many rows do you need?'
    })
    // OJO!: Las class validators no transforman los datos 
    @IsOptional()
    @IsPositive()
    //Con Type transforma la data a tipo number porque los querys viene como string
    @Type(()=>Number)
    limit?:number


    
    @ApiProperty({
        default:0, 
        description:'How many rows do you want skip?'
    })
    @IsOptional()
    @Min(0)
    @Type(()=>Number)
    offset?:number
}


