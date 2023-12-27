
import { v4 as uuid} from 'uuid'

// Funcion helper que sirve para  renombrar un arhivo
// Para este punto ya tenemso el archivo
export const fileNamer=(req:Express.Request,file:Express.Multer.File, callback:Function)=>{

    if(!file) return  callback(new Error ('File is empty'),false)
    
    const fileExtension=file.mimetype.split('/')[1]
    const newFileName = `${uuid()}.${fileExtension}`;
    callback(null,newFileName)
    
}