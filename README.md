<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Servicios web aplicación SanviPop (Versión Lite)

Servicios web REST reducidos construidos con **NestJS 12** y **MikroORM 7** para proyectos de desarrollo en entorno cliente. Esta versión omite toda la capa de usuarios y autenticación, ofreciendo exclusivamente la gestión de **productos** y **categorías**.

---

- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Configuración del Entorno (.env)](#configuración-del-entorno-env)
- [Gestión de la Base de Datos y Semilla Inicial](#gestión-de-la-base-de-datos-y-semilla-inicial)
- [Documentación Interactiva (Scalar / Swagger)](#documentación-interactiva-scalar--swagger)
- [Ejecución y Pruebas](#ejecución-y-pruebas)
- [Colecciones](#colecciones)
  - [Colección /categories](#colección-categories)
    - [GET /categories](#get-categories)
  - [Colección /products](#colección-products)
    - [GET /products](#get-products)
    - [GET /products/:id](#get-productsid)
    - [POST /products](#post-products)
    - [PUT /products/:id](#put-productsid)
    - [DELETE /products/:id](#delete-productsid)
    - [POST /products/:id/photos](#post-productsidphotos)
    - [DELETE /products/:idProd/photos/:idPhoto](#delete-productsidprodphotosidphoto)

---

## Instalación y puesta en marcha

El proyecto utiliza **SQLite** (`sanvipop.db`), por lo que no es necesario instalar ni configurar servidores de bases de datos externos. El archivo de base de datos se genera automáticamente y la aplicación siembra las categorías por defecto en el primer inicio.

1. Instalar las dependencias:

```bash
$ npm install
```

2. Crear el archivo de variables de entorno `.env` a partir de la plantilla:

```bash
$ cp .env.example .env
```

---

## Configuración del Entorno (.env)

El archivo `.env` contiene las opciones de configuración de la aplicación:

```env
PORT=3000
BASE_URL=http://localhost:3000
BASE_PATH=
DB_NAME=sanvipop.db
```

- **PORT**: Puerto en el que escuchará el servidor (por defecto 3000).
- **BASE_URL**: URL base para la resolución absoluta de imágenes (`http://localhost:3000`).
- **BASE_PATH**: Prefijo opcional para las rutas base.
- **DB_NAME**: Nombre o ruta del archivo de base de datos SQLite (`sanvipop.db`).

---

## Gestión de la Base de Datos y Semilla Inicial

El proyecto incluye scripts configurados en `package.json` para gestionar el ciclo de vida de la base de datos y su esquema:

```bash
# Eliminar todas las tablas del esquema
$ npm run db:drop

# Crear las tablas a partir de las entidades
$ npm run db:create

# Actualizar el esquema si se modifican las entidades
$ npm run db:update

# Regenerar y poblar la base de datos con datos de prueba
$ npm run db:seed
```

### Datos generados por el Seed (`npm run db:seed`)

Al ejecutar el comando de semilla, se generan:
1. **8 categorías oficiales:** Informática, Telefonía, Hogar, Deportes, Motor, Moda, Juegos, Otros.
2. **8 productos de ejemplo** en diversas categorías y estados.
3. **Galerías de fotografías** asociadas a cada producto.

---

## Documentación Interactiva (Scalar / Swagger)

La API cuenta con documentación interactiva autogenerada a través del compilador Swagger CLI Plugin y renderizada con **Scalar API Reference**:

- **Scalar API Reference (Recomendado):** [http://localhost:3000/reference](http://localhost:3000/reference)
- **Swagger UI Clásico:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## Ejecución y Pruebas

```bash
# Modo desarrollo con recarga en caliente
$ npm run start:dev

# Compilar para producción
$ npm run build

# Iniciar en producción
$ npm run start:prod

# Ejecutar tests unitarios
$ npm test

# Ejecutar tests e2e (end-to-end)
$ npm run test:e2e

# Análisis estático de código (linter rápido)
$ npm run lint
```

---

## Colecciones

> **Nota:** Todos los servicios de esta versión reducida son **públicos** y no requieren cabeceras de autorización (`Authorization: Bearer`).

---

### Colección /categories

#### **GET /categories**

Devuelve todas las categorías de productos disponibles en la base de datos.

**Respuesta exitosa (200 OK):**

```json
{
  "categories": [
    { "id": 1, "name": "Informática" },
    { "id": 2, "name": "Telefonía" },
    { "id": 3, "name": "Hogar" },
    { "id": 4, "name": "Deportes" },
    { "id": 5, "name": "Motor" },
    { "id": 6, "name": "Moda" },
    { "id": 7, "name": "Juegos" },
    { "id": 8, "name": "Otros" }
  ]
}
```

---

### Colección /products

#### **GET /products**

Devuelve la lista completa de productos disponibles en la base de datos. Permite filtrar por texto en título o descripción, por categoría y ordenar por fecha, precio o visitas.

**Parámetros de consulta (Query params, opcionales):**

- `search` (cadena, opcional): Término de búsqueda para título o descripción.
- `category` (número entero >= 1, opcional): Filtrar productos pertenecientes a una categoría específica.
- `sort` (cadena, opcional): Criterio de ordenación:
  - `date` (por defecto): Por fecha de publicación más reciente.
  - `price`: Por precio ascendente (más económico primero).
  - `views`: Por número de visitas ascendente.

*Ejemplos de peticiones:*
- `GET /products`
- `GET /products?search=bici`
- `GET /products?category=4`
- `GET /products?sort=price`
- `GET /products?search=ordenador&category=1&sort=price`

**Respuesta exitosa (200 OK):**

```json
{
  "products": [
    {
      "id": 1,
      "title": "Bicicleta de montaña Rockrider",
      "description": "Bicicleta de montaña en perfecto estado, talla M, ruedas 29 pulgadas, frenos de disco hidráulicos.",
      "price": 150.0,
      "status": 1,
      "datePublished": "2026-03-15T10:00:00.000Z",
      "numVisits": 24,
      "category": {
        "id": 4,
        "name": "Deportes"
      },
      "mainPhoto": "http://localhost:3000/img/products/product-1.jpg",
      "photos": [
        {
          "id": 1,
          "url": "http://localhost:3000/img/products/product-1.jpg"
        }
      ]
    }
  ]
}
```

---

#### **GET /products/:id**

Obtiene el detalle completo de un producto por su ID, incrementando automáticamente su contador de visitas (`numVisits`).

**Respuesta exitosa (200 OK):**

```json
{
  "product": {
    "id": 1,
    "title": "Bicicleta de montaña Rockrider",
    "description": "Bicicleta de montaña en perfecto estado, talla M, ruedas 29 pulgadas, frenos de disco hidráulicos.",
    "price": 150.0,
    "status": 1,
    "datePublished": "2026-03-15T10:00:00.000Z",
    "numVisits": 25,
    "category": {
      "id": 4,
      "name": "Deportes"
    },
    "mainPhoto": "http://localhost:3000/img/products/product-1.jpg",
    "photos": [
      {
        "id": 1,
        "url": "http://localhost:3000/img/products/product-1.jpg"
      }
    ]
  }
}
```

**Errores posibles:**
- **404 Not Found**: Si el producto no existe.

---

#### **POST /products**

Publica un nuevo producto. La foto principal se envía codificada en Base64, se almacena en el servidor y se vincula automáticamente.

**Petición (`application/json`):**

```json
{
  "title": "Monitor 27 pulgadas 4K",
  "description": "Monitor IPS sin arañazos, incluye cable HDMI y de corriente.",
  "price": 220.0,
  "category": 1,
  "mainPhoto": "data:image/jpeg;base64,..."
}
```

*Validaciones:*
- `title`: Entre 3 y 250 caracteres (obligatorio).
- `description`: Entre 10 y 2000 caracteres (obligatorio).
- `price`: Número estrictamente positivo (> 0).
- `category`: ID numérico entero de una categoría existente.
- `mainPhoto`: Cadena en Base64 (obligatorio).

**Respuesta exitosa (201 Created):** `{ "product": { ... } }`

---

#### **PUT /products/:id**

Modifica los datos de un producto existente.

**Petición (`application/json`):**

Todos los campos son opcionales:
- `title` (cadena 3-250 chars)
- `description` (cadena 10-2000 chars)
- `price` (número positivo)
- `category` (ID entero de categoría existente)
- `status` (1 = Disponible, 2 = Reservado, 3 = Vendido)
- `mainPhoto` (ID numérico de una foto existente perteneciente a este producto)

```json
{
  "title": "Monitor 27 pulgadas 4K (Rebajado)",
  "price": 199.99
}
```

**Respuesta exitosa (200 OK):** `{ "product": { ... } }`

**Errores posibles:**
- **400 Bad Request**: Datos no válidos, categoría inexistente o foto no perteneciente al producto.
- **404 Not Found**: Si el producto no existe.

---

#### **DELETE /products/:id**

Elimina el producto de la base de datos y borra físicamente sus imágenes asociadas del disco.

**Respuesta exitosa (204 No Content):** Sin contenido.

**Errores posibles:**
- **404 Not Found**: Si el producto no existe.

---

#### **POST /products/:id/photos**

Añade una foto adicional a la galería de un producto. Si se envía `"setMain": true`, además se establece como foto principal.

**Petición (`application/json`):**

```json
{
  "photo": "data:image/jpeg;base64,...",
  "setMain": true
}
```

**Respuesta exitosa (201 Created):**

```json
{
  "photo": {
    "id": 12,
    "url": "http://localhost:3000/img/products/1741818500-uuid.jpg"
  }
}
```

**Errores posibles:**
- **404 Not Found**: Si el producto no existe.

---

#### **DELETE /products/:idProd/photos/:idPhoto**

Elimina una fotografía de la galería del producto y borra físicamente el archivo del disco.

**Respuesta exitosa (204 No Content):** Sin contenido.

**Errores posibles:**
- **404 Not Found**: Si el producto o la fotografía no existen.
