import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('productimg')
  // el interceptor capta la data de la solicitud y lo intercepta
  //FileInterceptor solo funciona  con express  y el nombre file viene del nombre de la key del archivo Ej en postman o ThunderClient 
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:fileFilter
  }))
  upLoadProductImage(@UploadedFile() file:Express.Multer.File){
    if(!file){
      throw new BadRequestException('Make sure that the file is an image')
    }
    return {
      filename:file.originalname
    }
  }
  
}
