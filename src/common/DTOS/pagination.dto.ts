import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"


export class PaginationDTO{
    // OJO!: Las class validators no transforman los datos 
    @IsOptional()
    @IsPositive()
    //Con Type transforma la data a tipo number porque los querys viene como string
    @Type(()=>Number)
    limit?:number

    @IsOptional()
    @Min(0)
    @Type(()=>Number)
    offset?:number
}


