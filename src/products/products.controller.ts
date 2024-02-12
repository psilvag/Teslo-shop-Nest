import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/DTOS/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Product } from './entities/product.entity';



@ApiTags('Products')

@Controller('products')
//@Auth()   // con esto le decimos que para usar cualquiera de estas rutas debe estar autenticado

export class ProductsController {
  
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()  // con GetUser:obtenemos el usuario logueado

  @ApiResponse({status:201,description:'Product was created', type:Product})
  @ApiResponse({status:400,description:'Bad request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  
  create(@Body() createProductDto: CreateProductDto,
         @GetUser() user:User )  {
    return this.productsService.create(createProductDto,user);
  }

  @ApiResponse({status:200,description:'Find all Products,optional pagination Querys: limit&offset'})
  @ApiResponse({status:400,description:'Bad request'})
  @Get()
  findAll(@Query() paginationDTO:PaginationDTO) {
    return this.productsService.findAll(paginationDTO);
  }
  
  @ApiResponse({status:200,description:'Find product by ID,title o slug-name', type:Product})
  @ApiResponse({status:400,description:'Bad request'})
  @ApiResponse({status:404,description:'Item not Found'})
  @Get(':term') 
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }


  @ApiResponse({status:200,description:'Product was uptaded succesfully', type:Product})
  @ApiResponse({status:400,description:'Bad request'})
  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
  @Param('id',ParseUUIDPipe)id: string,  // ParseUUIDPipe valida que el id sea un uuid valido
  @Body() updateProductDto: UpdateProductDto,
  @GetUser() user:User) {
    return this.productsService.update(id, updateProductDto,user);
  }

  @ApiResponse({status:204,description:'Product deleted succesfully'})
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
