import { Controller, Get, Post ,Param,BadRequestException } from '@nestjs/common';
import { Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter,fileNamer } from './helpers';



@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
   
    private readonly filesService: FilesService,
    private readonly configService:ConfigService) {} //ConfigService  lo importamos de Nest para manejar las variables de entorno  en este modulo
    //-*OJO !: Se debe importar configService en el modulo files, ->: imports:[ConfigModule]
  @ApiResponse({status:200,description:'Return image request'})
  @ApiResponse({status:404,description:'Image not found'})
  @Get('product/:imageName')
  // al utilizar res le quitamos a nest el control de la repuesta, es decir nosostros controlamos la respuesta 
  findProductImage(@Res() res:Response, @Param('imageName') imageName:string){
   const path= this.filesService.getStaticProductImage(imageName) 
   res.sendFile(path) // regresamos el archivo que esta en ese path
  }

  
  @ApiResponse({status:201,description:'Image created'})
  @ApiResponse({status:400,description:'Bad request'})
  @Post('product')
  // el interceptor capta la data de la solicitud y lo intercepta
  //FileInterceptor solo funciona  con express  y el nombre "file" viene del nombre de la key del archivo. Ej en postman o ThunderClient:  file:nombreArchivoSeleccionado 
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:fileFilter,// fileFilter: es una funcion creada por nosotros
    //limits:{fileSize:1000} agregamos los limites que queremos para nuestros archivos
    storage:diskStorage({ // en donde estamos almacenando fisicamente las imagenes ,          diskStorage lo importamos de Multer
      destination:'./static/products',
      filename:fileNamer // fileNamer: es una funcion creada por nosotros
    }) 
  }))

  upLoadProductImage(@UploadedFile() file:Express.Multer.File){
    if(!file){
      throw new BadRequestException('Make sure that the file is an image')
    } 
    const secureURL=`${this.configService.get('HOST_API')}/files/product/${file.filename}`
    return {
      secureURL
      
    }
  }
  
}
