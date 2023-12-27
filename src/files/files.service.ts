import { join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';



@Injectable()
export class FilesService {
 
getStaticProductImage(imageName:string){
const path= join(__dirname,'../../static/products',imageName) // path fisico donde se encuentra la imagen, si en el fylesytem o el servidor
if(!existsSync(path)) throw new BadRequestException(`Not found image with id ${imageName}`)
    
return path
}

}
