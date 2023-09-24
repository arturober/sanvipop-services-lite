<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- [Servicios web applicación SanviPop](#servicios-web-applicación-sanvipop)
  - [Instalación de los servicios](#instalación-de-los-servicios)
  - [Configurando notificaciones Push](#configurando-notificaciones-push)
  - [Probando los servicios](#probando-los-servicios)
- [Servicios web - Colecciones](#servicios-web---colecciones)
  - [Colección /auth](#colección-auth)
    - [**POST /auth/login**](#post-authlogin)
    - [**POST /auth/google**](#post-authgoogle)
    - [**POST /auth/facebook**](#post-authfacebook)
    - [**POST /auth/register**](#post-authregister)
    - [**GET /auth/validate**](#get-authvalidate)
  - [Colección /categories](#colección-categories)
    - [**GET /categories**](#get-categories)
  - [Colección /products](#colección-products)
    - [**GET /products**](#get-products)
    - [**GET /products/mine**](#get-productsmine)
    - [**GET /products/bookmarks**](#get-productsbookmarks)
    - [**GET /products/mine/sold**](#get-productsminesold)
    - [**GET /products/mine/bought**](#get-productsminebought)
    - [**GET /products/user/:id**](#get-productsuserid)
    - [**GET /products/user/:id/sold**](#get-productsuseridsold)
    - [**GET /products/user/:id/bought**](#get-productsuseridbought)
    - [**GET /products/:id**](#get-productsid)
    - [**POST /products**](#post-products)
    - [**DELETE /products/:id**](#delete-productsid)
    - [**PUT /products/:id**](#put-productsid)
    - [**PUT /products/:id/buy**](#put-productsidbuy)
    - [**POST /products/:id/bookmarks**](#post-productsidbookmarks)
    - [**DELETE /products/:id/bookmarks**](#delete-productsidbookmarks)
    - [**POST /products/:id/photos**](#post-productsidphotos)
    - [**DELETE /products/:id/photos/:idPhoto**](#delete-productsidphotosidphoto)
  - [Colección /users](#colección-users)
    - [**GET /users/me**](#get-usersme)
    - [**GET /users/:id**](#get-usersid)
    - [**GET /users/name/:name**](#get-usersnamename)
    - [**PUT /users/me**](#put-usersme)
    - [**PUT /users/me/photo**](#put-usersmephoto)
    - [**PUT /users/me/password**](#put-usersmepassword)
  - [Colección /ratings](#colección-ratings)
    - [**POST /ratings**](#post-ratings)
    - [**GET /ratings/user/me**](#get-ratingsuserme)
    - [**GET /ratings/user/:id**](#get-ratingsuserid)

# Servicios web applicación SanviPop

Servicios web para los proyectos de la asignatura de entorno cliente.

## Instalación de los servicios

Para lanzar los servicios en local, primero importar la base de datos (directorio SQL). A continuación configuramos el acceso a la base de datos en el archivo **src/micro-orm.config.ts**:

```typescript
import {ConnectionOptions} from '@mikro-orm/core';

export default {
    entities: ['dist/entities/*.js'], // compiled JS files
    entitiesTs: ['src/entities/*.ts'],
    dbName: 'sanvipop',
    type: 'mariadb', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
    user: 'example',
    password: 'example',
    port: 3306,
    host: 'localhost',
    debug: true
} as ConnectionOptions;
```

Después instalamos las dependencias del proyecto:

```bash
$ npm install
```

Edita el archivo **src/google-id.ts** para poner ahí tu id de Google (la que uses en el cliente) o no funcionará el login con dicho proveedor.

## Configurando notificaciones Push

<p style="color: red">Este apartado todavía no es funcional (para el proyecto de Ionic lo será)<p> 

Descarga el archivo de cuenta de servicio (Configuración de proyecto -> cuentas de servicio) dentro de la carpeta **firebase** y renombralo a **serviceAccountKey.json**. Tiene que ser el mismo proyecto que uses en la aplicación cliente donde habrás descargado el archivo **google-services.json**. Los servicios están configurados para mandar una notificación push cuando alguien compre un producto del usuario o le valore en una transacción.

## Probando los servicios

Lanzamos los servicios (modo testing) con el siguiente comando:

```bash
$ npm run start
```

También los podéis desplegar en un servidor utilizando por ejemplo Apache + [Passenger](https://www.phusionpassenger.com/library/deploy/apache/deploy/nodejs/)

# Servicios web - Colecciones

Normalmente, todos los servicios (que devuelven datos) devuelven un resultado en formato JSON. Cuando no se pueda realizar una operación, devolverán un código de error HTTP junto a un objeto JSON con la descripción del mismo.

Todas las colecciones, excepto **/auth** (*/auth/validate* sí lo requiere), requieren un token de autenticación para poder utilizar los servicios web, devolviendo un código 401 (Not Authorized) en caso de no incluirlo. Este debe enviarse en la cabecera Authorization con el prefijo Bearer:

```
Authorization: Bearer auth_token
```

## Colección /auth

### **POST /auth/login**

El servicio comprueba si un usuario y contraseña son correctos, devolviendo un token de autenticación (JWT) si todo va bien. Opcionalmente se puede enviar la posición del usuario para que la actualice.

Ejemplo de petición:

```json
{
    "email": "prueba@email.es",
    "password": "1234",
    "lat": 35.4534,
    "lng": -0.54673
}
```

Si el login es correcto, la respuesta será algo como esto:

```json
{
    "expiresIn": 31536000,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTc4MTYyNDA2LCJleHAiOjE2MDk2OTg0MDZ9.HQZ-PO-usLc9WT-0cUpuDPnVRFl_u71njNoQNj_TIx8"
}
```

En caso de error en el login (usuario y contraseña no válidos), se devolverá el código de error 401:

```json
{
    "status": 401,
    "error": "Email or password incorrect"
}
```

### **POST /auth/google**

Este servicio recibe el campo **id_token** que devuelve la identificación mediante Google en el cliente. Lo valida y comprueba el correo en la base de datos. Si el correo existe funciona como un login normal, y si no existe registra al usuario (a partir de los datos obtenidos de Google) en la base de datos. Devuelve un token de autenticación válido para el servidor (como el login).

Ejemplo de envío (lat y lng son opcionales):

```json
{
    "token": "id_token de Google",
    "lat": 35.4534,
    "lng": -0.54673
}
```

La respuesta es la misma que la del servicio /auth/login

### **POST /auth/facebook**

Este servicio recibe el campo **accessToken** que devuelve la identificación mediante Facebook en el cliente. Lo valida y comprueba el correo en la base de datos. Si el correo existe funciona como un login normal, y si no existe registra al usuario (a partir de los datos obtenidos de Facebook) en la base de datos. Devuelve un token de autenticación válido para el servidor (como el login).

Ejemplo de envío (lat y lng son opcionales):

```json
{
    "token": "accessToken de Facebook",
    "lat": 35.4534,
    "lng": -0.54673
}
```

La respuesta es la misma que la del servicio /auth/login

### **POST /auth/register**

Este servicio recibe los datos de un usuario y lo registra en la base de datos. Los datos que recibirá son nombre, email, password, foto de perfil y opcionalmente, las coordenadas de geolocalización. Ejemplo de petición:

```json
{
    "name": "Prueba",
    "email": "prueba@correo.es",
    "password": "1234",
    "photo": "Imagen codificada en base64",
    "lat": 35.4534,
    "lng": -0.54673
}
```

Si la petición es correcta, el servidor devolverá una respuesta **201** (Created) con el correo del usuario creado:

```json
{
    "email": "prueba@correo.es"
}
```

Mientras que si hay algún error en los datos enviados, devolverá un código **400** (Bad Request) con información de los errores:

```json
{
    "statusCode": 400,
    "message": [
        "Email test3@test3.com is already present in the database"
    ],
    "error": "Bad Request"
}
```

### **GET /auth/validate**

Este servicio simplemente comprueba que el token de autenticación que se envía en la cabecera **Authorization** es correcto (y se ha enviado), devolviendo una respuesta vacía **204** si hay token y es válido o un error **401** (Not Authorized) si no lo es.

## Colección /categories

Todos los servicios de esta colección requieren del token de autenticación.

### **GET /categories**

Este servicio te devuelve las categorías para productos de la base de datos en el siguiente formato:

```json
{
    "categories": [
        {
            "id": 1,
            "name": "Electronics"
        },
        {
            "id": 2,
            "name": "Motor and vehicles"
        },
        ...
    ]
}
```

## Colección /products

Todos los servicios de esta colección requieren del token de autenticación.

### **GET /products**

Devuelve todos los productos a la venta ordenados por distancia hasta el usuario autenticado. Los productos devueltos no tendrán toda la información completa, hay campos que estarán a null y que se obtendrán llamando al servicio que te devuelve los datos de un solo producto. Ejemplo de respuesta con un producto:

```json
{
    "products": [
        {
            "id": 438,
            "datePublished": "2020-12-20T11:54:59.000Z",
            "title": "Test product new",
            "description": "Product with\n2 lines",
            "status": 1,
            "price": 23.35,
            "owner": {
                "id": 15,
                "registrationDate": "2020-11-01T10:13:04.000Z",
                "name": "Test User",
                "email": "test@test.com",
                "lat": 38,
                "lng": -0.5,
                "photo": "http://SERVER/img/users/1606587397679.jpg"
            },
            "numVisits": 5,
            "category": {
                "id": 1,
                "name": "Electronics"
            },
            "mainPhoto": "http://SERVER/img/products/1608465299244.jpg",
            "soldTo": null,
            "rating": null,
            "photos": null,
            "bookmarked": false,
            "distance": 34.36346,
            "mine": true
        },
        ...
    ]
}
```

### **GET /products/mine**

Igual que el servicio **/products** pero devuelve solo los productos que vende el usuario actual.

### **GET /products/bookmarks**

Igual que el servicio **/products** pero devuelve los productos marcados como favoritos por el usuario actual.

### **GET /products/mine/sold**

En este caso devuelve los productos que el usuario actual ya ha vendido a otro usuario (status = 3).

### **GET /products/mine/bought**

Lista de productos que el usuario actual ha comprado a otros usuarios.

### **GET /products/user/:id**

Devuelve los productos que el usuario cuya id recibe en la url está vendiendo actualmente.

### **GET /products/user/:id/sold**

Devuelve los productos que el usuario cuya id recibe en la url ha vendido a otros usuarios.

### **GET /products/user/:id/bought**

Devuelve los productos que el usuario cuya id recibe en la url ha comprado a otros usuarios.

### **GET /products/:id**

Devuelve los datos del producto cuya id se recibe en la url. Este producto tendrá datos adicionales como la lista de fotos, las valoraciones del comprador y vendedor (si ha sido comprado y valorado), o el usuario que lo ha comprado el producto (si lo hay).

Ejemplo de respuesta de la llamada a **/products/392** (producto vendido):

```json
{
    "product": {
        "id": 392,
        "datePublished": "2020-11-19T21:28:38.000Z",
        "title": "Have a hand",
        "description": "A second hand for usefull usses",
        "status": 3,
        "price": 25,
        "owner": {
            "id": 98,
            "registrationDate": "2020-11-19T21:27:23.000Z",
            "name": "Irene-Prueba",
            "email": "irene-prueba@mail.com",
            "lat": 38.4018273,
            "lng": -0.5241973,
            "photo": "http://SERVER/img/users/1605821243453.jpg"
        },
        "numVisits": 5,
        "category": {
            "id": 9,
            "name": "Home appliances"
        },
        "mainPhoto": "http://SERVER/img/products/1605821318532.jpg",
        "soldTo": {
            "id": 15,
            "registrationDate": "2020-11-01T10:13:04.000Z",
            "name": "Test User",
            "email": "test@test.com",
            "lat": 38,
            "lng": -0.5,
            "photo": "img/users/1606587397679.jpg"
        },
        "rating": {
            "sellerRating": null,
            "buyerRating": 5,
            "sellerComment": null,
            "buyerComment": "Good buyer",
            "dateTransaction": "2020-12-20T10:49:44.000Z"
        },
        "photos": [
          {
              "id": 367,
              "url": "http://SERVER/img/products/1605821318532.jpg"
          }
        ],
        "bookmarked": true,
        "distance": 44.6710090637207,
        "mine": false
    }
}
```

Si el producto no existe, el servidor deberá devolver un error **404**.

```json
{
    "statusCode": 404,
    "message": "Product not found",
    "error": "Not Found"
}
```

### **POST /products**

Este servicio inserta un nuevo producto a la base de datos y lo asocia al usuario autenticado. El producto por defecto estará "en venta" (status = 1).

Esta es la información necesaria para crear un producto que debemos enviar al servidor:

```json
{
    "title": "Test product new",
    "description": "Product with\n2 lines",
    "category": 1,
    "price": 23.35,
    "mainPhoto": "Imagen en Base64"
}
```

Si todo es correcto, el servidor nos responderá con el producto añadido. Este tendrá más información de la que originalmente enviamos al servidor, como los datos del usuario creado, el estado, número de visitas, o la url de la imagen, entre otras:

```json
{
    "product": {
        "status": 1,
        "photos": [
            {
                "url": "http://SERVER/img/products/1609248956049.jpg",
                "id": 437
            }
        ],
        "title": "Test product new",
        "description": "Product with\n2 lines",
        "price": 23.35,
        "owner": {
            "id": 15,
            "registrationDate": "2020-11-01T10:13:04.000Z",
            "name": "Test User",
            "email": "test@test.com",
            "lat": 38,
            "lng": -0.5,
            "photo": "http://SERVER/img/users/1606587397679.jpg"
        },
        "category": {
            "id": 1
        },
        "id": 446,
        "mainPhoto": "http://SERVER/img/products/1609248956049.jpg",
        "mine": true
    }
}
```

Si algún campo no tuviera un formato correcto o no estuviera presente, el servidor nos responderá con un error **400** (Bad Request) e información sobre lo que ha fallado:

```json
{
    "statusCode": 400,
    "message": [
        "category should not be empty",
        "category must be an integer number",
        "price should not be empty",
        "price must be a number conforming to the specified constraints",
        "mainPhoto should not be empty",
        "mainPhoto must be a string"
    ],
    "error": "Bad Request"
}
```

### **DELETE /products/:id**

Este servicio borra el producto cuya id se especifica en la url. Devuelve una respuesta vacía **204** si el producto se ha borrado, o un error 404 si intentamos borrar un producto que no existe.

En caso de intentar borrar un producto que no es nuestro, nos responderá con un error **403** (Forbidden):

```json
{
    "statusCode": 403,
    "message": "You can't edit or delete other user's products",
    "error": "Forbidden"
}
```

### **PUT /products/:id**

Similar al servicio de añadir producto pero para editar un producto existente. En la url se debe especificar la id del producto que vamos a modificar. Todos los campos a editar son opcionales, es decir, se solo se cambiará la información enviada en la base de datos.

A continuación vamos a ver 3 posibilidades para editar la información de un producto.

1. Modificar información básica del producto (como añadir pero sin la foto). La categoría al igual que al añadir, debe enviarse como número (id de la nueva categoría).

```json
{
    "title": "Test product Updated",
    "description": "Product with\n2 lines and more",
    "category": 2,
    "price": 43
}
```

2. Cambiar el estado de un producto. La propiedad **status** indica: 1 - en venta, 2 - reservado, 3 - vendido. A la hora de cambiar el estado de un producto a "vendido", se deberá enviar también la id del usuario al que se le ha vendido (propiedad **soldTo**). Ejemplo:

```json
{
    "status": 3,
    "soldTo": 1
}
```

3. Finalmente, también se puede usar este servicio para establecer una nueva foto principal para el producto. Enviando como valor de la propiedad **mainPhoto**, la id de una de las imagénes que tenga el producto asociadas.

```json
{
    "mainPhoto": 204
}
```

La respuesta de este servicio será el producto actualizado, igual que el servicio de insertar producto. Se pueden producir errores del tipo **400** si algún campo es erróneo, **404** si el producto a editar no existe, o **403** si intentamos editar un producto que no es nuestro.

### **PUT /products/:id/buy**

Este servicio se llama cuando el usuario autenticado quiere comprar el producto cuya id se especifica en la url. El cuerpo de la petición en este caso estará **vacío**. Automáticamente se pondrá el estado del producto a 3 (vendido) y se asociará el usuario autenticado como comprador.

El servidor responderá también sin datos (**204**) si todo ha ido bien, o con un error, como por ejemplo 404 si el producto no existe.

### **POST /products/:id/bookmarks**

Este servicio añade el producto cuya id se pasa por parámetro, a la lista de favoritos del usuario autenticado. No se envía ningún dato con la petición y la respuesta igualmente será vacía (**204**) si todo ha ido correctamente.

### **DELETE /products/:id/bookmarks**

Borra el producto especificado de la lista de favoritos del usuario autenticado. La respuesta estará vacía (**204**) si no se produce ningún error.

### **POST /products/:id/photos**

Añade una imagen al producto cuya id se envía en la url (los productos pueden tener varias imágenes asociadas). El cuerpo de la petición será la imagen en formato base64. Adicionalmente se puede enviar el campo setMain: true, para que además de añadir la imagen, la asocie como imagen principal del producto.

```json
{
    "photo": "Imagen en base64",
    "setMain": true
}
```

La respuesta del servidor será la foto añadida, con la id y url generadas. O un error como 404 si el producto no existe.

```json
{
    "photo": {
        "url": "http://SERVER/img/products/1609348722463.jpg",
        "id": 439
    }
}
```

### **DELETE /products/:id/photos/:idPhoto**

Este servicio borra la foto del producto especificado en la url (:id). Además, se especifica la id de la foto que se borrará (:idPhoto).

El servidor devolverá una respuesta vacía si todo va bien, o un código de error como **404** si el producto no existe o la foto a borrar no pertenece al producto especificado. Si intentamos borrar una foto de un producto que no sea nuestro, nos responderá con un error **403**.

## Colección /users

Todos los servicios de esta colección requieren del token de autenticación.

### **GET /users/me**

Devuelve la información del perfil del usuario autenticado. El booleano me indica si la información es del usuario autenticado o de otro.

```json
{
    "user": {
        "id": 15,
        "registrationDate": "2020-11-01T10:13:04.000Z",
        "name": "Test User",
        "email": "test@test.com",
        "lat": 38,
        "lng": -0.5,
        "photo": "http://SERVER/img/users/1606587397679.jpg",
        "me": true
    }
}
```

### **GET /users/:id**

Igual que **/users/me** pero devuelve la información del usuario cuya id recibe en la url. Devuelve un error **404** si el usuario no existe.

Ejemplo de llamada a **/users/1**:

```json
{
    "user": {
        "id": 1,
        "registrationDate": "2016-12-31T11:18:14.000Z",
        "name": "Prueba",
        "email": "prueba@correo.es",
        "lat": 38.401827000000004,
        "lng": -0.524191,
        "photo": "http://SERVER/img/users/1605562674191.jpg",
        "me": false
    }
}
```

### **GET /users/name/:name**

Este servicio busca usuarios a partir de la cadena que se le pasa como variable en la url. Te devuelve un array con los datos de los usuarios cuyo nombre contenga la cadena de búsqueda.

Ejemplo de respuesta al llamar a **/users/name/pru**:

```json
{
    "users": [
        {
            "id": 1,
            "registrationDate": "2016-12-31T11:18:14.000Z",
            "name": "Prueba",
            "email": "prueba@correo.es",
            "lat": 37,
            "lng": -0.5,
            "photo": "http://SERVER/img/users/1605562674191.jpg",
            "me": false
        },
        {
            "id": 22,
            "registrationDate": "2020-11-04T16:10:58.000Z",
            "name": "PruebaX01",
            "email": "prueba@bien.com",
            "lat": 38.3681882,
            "lng": -0.49744510000000003,
            "photo": "http://SERVER/img/users/1604506258691.jpg",
            "me": false
        }
    ]
}
```

### **PUT /users/me**

Modifica la información del nombre y correo del usuario autenticado.

Ejemplo de petición:

```json
{
  "name": "John",
  "email": "email@email.com"
}
```

El servidor devolverá una respuesta vacía **204**, si todo va bien o un error **400** si algún campo es erróneo, no está presente, o intentamos asignar un correo que ya tiene otro usuario.

### **PUT /users/me/photo**

Modifica la imagen del usuario autenticado. Ejemplo de petición:

```json
{
    "photo": "Imagen en base 64"
}
```

Si no hay ningún error, responde con la url de la nueva imagen almacenada en el servidor:

```json
{
    "photo": "http://SERVER/img/users/1609451684334.jpg"
}
```

### **PUT /users/me/password**

Actualiza la contraseña del usuario autenticado. Ejemplo de petición

```json
{
  "password": "1234"
}
```

Si todo va bien, el servidor devuelve una respuesta vacía **204**.

## Colección /ratings

Todos los servicios de esta colección requieren del token de autenticación.

### **POST /ratings**

Llamamos a este servicio para puntuar una transacción de algún producto que hayamos comprado o vendido. Debemos pasarle la id del producto, el comentario y una valoración del 1 al 5. Solo se puede valorar la transacción de un producto **una sola vez**.

Ejemplo de llamada:

```json
{
    "rating": 5,
    "comment": "Good buyer",
    "product": 392
}
```

Si todo va bien, el servidor nos devolverá una respuesta vacía **204**.

Si algún campo no está o no tiene un formato correcto, nos devolvería un error **400**, mientras que en caso de realizar una operación no permitida como comentar 2 veces el mismo producto, nos devolvería un error **403**.

### **GET /ratings/user/me**

Devuelve un array con las puntuaciones recibidas por parte de otros usuarios en transacciones realizadas. Cada puntuación contendrá la información del producto, del usuario que nos ha valorado, la puntuación y el comentario.

Ejemplo de respuesta:

```json
{
    "ratings": [
        {
            "product": {
                "id": 436,
                "rating": 436,
                "datePublished": "2020-12-17T16:22:18.000Z",
                "title": "Complete suitcase",
                "description": "It covers ALL your needs\nGuaranteed!",
                "status": 3,
                "price": 145,
                "owner": {
                    "id": 15,
                    "registrationDate": "2020-11-01T10:13:04.000Z",
                    "name": "Test 3",
                    "email": "test333@email.com",
                    "lat": 38,
                    "lng": -0.5,
                    "photo": "http://SERVER/img/users/1609451684334.jpg"
                },
                "numVisits": 9,
                "category": 10,
                "mainPhoto": 420,
                "soldTo": {
                    "id": 131,
                    "registrationDate": "2020-12-23T15:00:55.000Z",
                    "name": "Ivanset",
                    "email": "ivanset@gmail.com",
                    "lat": 38.3746048,
                    "lng": -0.49151999999999996,
                    "photo": "http://SERVER/img/users/1608822623745.jpg"
                }
            },
            "user": {
                "id": 131,
                "registrationDate": "2020-12-23T15:00:55.000Z",
                "name": "Ivanset",
                "email": "ivanset@gmail.com",
                "lat": 38.3746048,
                "lng": -0.49151999999999996,
                "photo": "http://SERVER/img/users/1608822623745.jpg"
            },
            "comment": "Good enough!",
            "rating": 2
        }
    ]
}
```

### **GET /ratings/user/:id**

Este servicio es exactamente igual que el anterior, pero nos devuelve las puntuaciones que el usuario cuya id pasamos en la url, ha recibido.
