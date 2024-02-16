<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Acerca de la API

Este proyecto es una interfaz para el manejo de un CRUD completo de usuarios, productos y la carga de archivos correspondientes a las imagenes de cada producto, los datos iniciales se cargan en la base de datos por medio de un seeder que es montado con datos creados de forma propia para la API.
Las imagenes son almacenadas en el fileSystem y no provienen de otro servidor.

Como base de datos se utiliza ```Postgres``` montado en un contenedor de ```Docker``` usando la imagen de Postgres:14.3.
La API cuenta con endpoints para el registro de usuarios y para el login de los mismos.

En la API tambien se implemetó ```Sockets``` y ```WebSocketsServers``` para crear un chat con autenticación ```Json Web Token``` reutilizando el codigo de autenticacion y autorizacion de usuarios.

# 🚀 Guia para la ejecución NEST-TESLO-SHOP

# Stack usado
* Postgres
* NodeJS
* Express
* TypeScript
* Docker
* Nest
* Bcrypt
* Passport
* Json-Web-Token


# Teslo API
1. Clonar el repositorio
2. Instalar la dependencias
```
yarn install
```
3. Copiar el archivo .env.template y renombrarlo como .env
4. Llenar las variables de entorno en funcion a la aplicacion
5. Abrir la aplicacion de docker en su computadora para que se reconozcan los comandos docker en la terminal (si no lo tiene instalado, descargue e instale [Docker](https://www.docker.com/products/docker-desktop/)
6. Levantar la base de datos en docker
```
docker-compose up -d
```
7. Ejecutar la aplicacion en desarrollo
```
yarn start:dev
```
8. Ejecutar SEED para llenar la data
```
localhost:3000/api/seed
```
9. Ir a la documentacion de la API
```
localhost:3000/api
```



### Nota: 
* La aplicacion levanta un contenedor de docker basada en la imagen de **POSTGRES 14.3** como base de datos
* Si la app no logra establecer una conexion con nuestra base de datos, es por el conflicto de los puertos, esto ocurre porque ya tenemos instalado postgres en nuestra PC; para solucionarlo, **ES NECESARIO DESINSTALAR POSTGRES DE LA PC** y luego verificar nuevamente la conexion.

