
export const fileFilter=(req:Express.Request,file:Express.Multer.File, callback:Function)=>{

    if(!file) return  callback(new Error ('File is empty'),false)

    const fileExtension= file.mimetype.split('/')[1]// el mimetype es de tipo : image/jpg, image/png, al ejecutar .split separamos el mimetype en un array y queda [image,jpg] y tomamos la pos [1]
    const validExtensions=["jpg","png","jpeg","gif"]
    if(validExtensions.includes(fileExtension))
    {
        return callback(null,true)
    }
    callback(null,false)// recibe dos argumentos error y un booleano, archivo aceptado o rechazado
}