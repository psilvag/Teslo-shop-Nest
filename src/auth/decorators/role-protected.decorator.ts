import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';

export const META_ROLES='roles'


// esta funcion la realizamos para evitar la volatilidad de los roles ya que podria escribirse por ejemplo role y no roles o en los roles ['admin',''super-use] y no super-user como debe ser ,lo  cual crearia errores. Con este decorator nos aseguramos estos detalles y lo hacemos todo en uno
export const RoleProtected = (...args: ValidRoles[]) => {
         return SetMetadata(META_ROLES,args)
         
};
