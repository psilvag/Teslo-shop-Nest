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
5. Levantar la base de datos en docker
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
8. Ir a la documentacion de la API
```
localhost:3000/api
```

### Nota: 
* La aplicacion levanta un contenedor de docker basada en la imagen de **POSTGRES 14.3** como base de datos
* Si la app no logra establecer una conexion con nuestra base de datos, es por el conflicto de los puertos, esto ocurre porque ya tenemos instalado postgres en nuestra PC; para solucionarlo, **ES NECESARIO DESINSTALAR POSTGRES DE LA PC** y luego verificar nuevamente la conexion.

