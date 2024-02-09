//import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';


// Partial Types lo importamos de swagger y ya no de nest para que tome los ApiProperty y se relfeje en nuestra documentacion
export class UpdateProductDto extends PartialType(CreateProductDto) {}
