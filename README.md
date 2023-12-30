<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API
1. Clonar el repositorio
2. Instalar la dependencias
```
yarn install
```
3. Copiar el archivo .env.template y renombrarlo como .env
4. Llenar las variables de entorno en funcion a la aplicacion
5. Levantar la base de datos
```
docker-compose up -d
```
6. Ejecutar la aplicacion en desarrollo
```
yarn start:dev
```
7. Ejecutar SEED para llenar la data
```
localhost:3000/api/seed
```

### Nota: 
* La aplicacion usa docker como la base de datos postgres, y no logra establecer una conexion con postgres en Docker si se TIENE INSTALADO POSTGRES EN LA PC, **ES NECESARIO DESINSTALAR POSTGRES DE LA PC** para lograr la conexion.

