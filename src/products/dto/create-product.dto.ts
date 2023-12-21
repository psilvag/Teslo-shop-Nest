
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductDto {
 
  @IsString()
  @MinLength(1) 
  title:string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?:number

  @IsString()
  @IsOptional()
  description?:string 
  
  @IsString()
  @IsOptional()
  slug?:string

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?:number

  @IsString({each:true}) // validamos que cada elemento de ese array sea un string
  @IsArray()
  sizes:string[]
  
  @IsIn(['men','women','kid','unisex'])// Validamos que el valor que venga en gender se encuentre dentro de ese array IsIn()
  gender:string
  
  @IsString({each:true})
  @IsArray()
  @IsOptional()
  tags:string[]
  
}
