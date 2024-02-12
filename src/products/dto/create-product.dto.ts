
import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductDto {
  @ApiProperty({
    example:'Product title',
  })
  @IsString()
  @MinLength(1) 
  title:string

  @ApiProperty({
    example:567.90,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?:number

  @ApiProperty({
    example:'Lorem ipsum color',
  })
  @IsString()
  @IsOptional()
  description?:string 
  
  @ApiProperty({
    example:'T-shirt_Teslo',
  })
  @IsString()
  @IsOptional()
  slug?:string

  @ApiProperty({
    example:10,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?:number

  @ApiProperty({
    example:['XS','S','M','L','XL','XXL','XXXL'],
  })
  @IsString({each:true}) // validamos que cada elemento de ese array sea un string
  @IsArray()
  sizes:string[]
  
  @ApiProperty({
    example:['men','women','kid','unisex']
  })
  @IsIn(['men','women','kid','unisex'])// Validamos que el valor que venga en gender se encuentre dentro de ese array IsIn()
  gender:string
  

  @ApiProperty({
    example:['sweatshirt','jacket']
  })
  @IsString({each:true})
  @IsArray()
  @IsOptional()
  tags:string[]


  @ApiProperty({
    example:['urlImg1','urlImg2','urlImg3','urlImg4','...']
  })
  @IsString({each:true})
  @IsArray()
  @IsOptional()
  images?:string[]
}

