# SEPOMEX API REST

API REST desarrollada con Bun y Elysia para consultar la base de datos de códigos postales de México (SEPOMEX).

<div align="center">
  <img src="https://img.shields.io/badge/-Bun-000000?style=for-the-badge&logo=bun&labelColor=282c34" style="border-radius: 3px;" />
  <img src="https://img.shields.io/badge/-Elysia-000000?style=for-the-badge&logo=elysia&labelColor=282c34" style="border-radius: 3px;" />
  <img src="https://img.shields.io/badge/-Scalar-000000?style=for-the-badge&logo=scalar&labelColor=282c34" style="border-radius: 3px;" />
  <img src="https://img.shields.io/badge/-Biome-000000?style=for-the-badge&logo=biome&labelColor=282c34" style="border-radius: 3px;" />
</div>

## Fuente de Datos

Los datos originales provienen del Servicio Postal Mexicano (SEPOMEX) a través de su página oficial, aunque fueron obtenidos de [VIDELCLOUD](https://videlcloud.wordpress.com/2017/01/17/descarga-la-base-de-datos-de-codigos-postales-colonias-municipios-y-estados-de-todo-mexico/) que mantiene una copia actualizada al 2021-10-01.

> [!NOTE]
>
> - Última actualización: 2021-10-01
> - Incluye códigos postales, colonias y municipios de todo México
> - Los asentamientos pueden ser: colonias, fraccionamientos, barrios, ejidos, etc.
> - Se conservan acentos y caracteres especiales en los nombres

## Instalación

### Requisitos previos

- Bun instalado (visita [bun.sh](https://bun.sh) para instrucciones)
- Base de datos PostgreSQL con el esquema y datos v2 de SEPOMEX (ver [Proyecto Relacionado](#proyecto-relacionado))

### Clonar el repositorio

```bash
gh repo clone gschz/sepomex-api-rest
cd sepomex-api-rest
```

### Instalar dependencias

```bash
bun install
```

### Configurar variables de entorno

```bash
cp .env.example .env
```

> [!IMPORTANT]
> Es necesario configurar correctamente las variables de entorno, especialmente las credenciales de la base de datos PostgreSQL.

### Iniciar el servidor

```bash
bun dev
```

## Documentación interactiva

La API expone su documentación OpenAPI 3.0.3 con la interfaz de [Scalar](https://scalar.com) en:

```text
GET /api/v2/openapi
```

Además del documento JSON:

```text
GET /api/v2/openapi/json
```

> [!NOTE]
> Los endpoints de búsqueda leen de la vista materializada `vm_codigos_postales`. Si la base de datos se repuebla, ejecuta `REFRESH MATERIALIZED VIEW vm_codigos_postales;` para que los datos sean visibles.

## Uso y endpoints

Todos los endpoints están bajo el prefijo `/api/v2`:

| Método | Endpoint                                        | Descripción                                         |
| ------ | ----------------------------------------------- | --------------------------------------------------- |
| GET    | `/api/v2/postal/search?q={termino}`             | Busca asentamientos por nombre                      |
| GET    | `/api/v2/postal/codigo/{codigo}`                | Detalle por código postal (5 dígitos)               |
| GET    | `/api/v2/postal/estado/{id}`                    | Códigos postales por estado (2 dígitos)             |
| GET    | `/api/v2/postal/municipio/{estado}/{municipio}` | Códigos postales por estado y municipio (3 dígitos) |
| GET    | `/api/v2/postal/ciudad/{estado}/{ciudad}`       | Códigos postales por estado y ciudad (2 dígitos)    |
| GET    | `/api/v2/states/`                               | Todos los estados                                   |
| GET    | `/api/v2/states/{id}`                           | Estado por ID                                       |
| GET    | `/api/v2/states/{id}/cities`                    | Ciudades de un estado                               |
| GET    | `/api/v2/states/{id}/municipios`                | Municipios de un estado                             |
| GET    | `/api/v2/states/{id}/asentamientos`             | Asentamientos de un estado                          |
| GET    | `/api/v2/cities/`                               | Todas las ciudades                                  |
| GET    | `/api/v2/cities/{estado}/{ciudad}`              | Ciudad por estado y ciudad                          |
| GET    | `/api/v2/cities/{estado}/{ciudad}/colonias`     | Colonias de una ciudad                              |
| GET    | `/api/v2/cities/{estado}/{ciudad}/codigos`      | Códigos postales de una ciudad                      |

### Búsqueda por nombre de asentamiento

```bash
curl "http://localhost:3000/api/v2/postal/search?q=centro"
```

### Búsqueda por código postal

```bash
curl "http://localhost:3000/api/v2/postal/codigo/01000"
```

### Filtrar por estado y municipio

```bash
curl "http://localhost:3000/api/v2/postal/municipio/09/010"
```

Respuesta estándar:

```json
{
  "success": true,
  "message": "Búsqueda realizada con éxito",
  "data": []
}
```

> [!WARNING]
>
> - Los datos pueden contener errores tipográficos
> - No se garantiza la actualización en tiempo real
> - Para uso oficial, se recomienda consultar directamente con SEPOMEX
> - Este proyecto es una implementación de referencia y educativa

## Tests

Pruebas E2E de humo para todos los endpoints (requieren el servidor corriendo y la base de datos poblada):

```bash
bun test
```

```bash
BASE_URL=http://localhost:3000/api/v2 bun test
```

## Estructura de los datos

La API consume una base de datos PostgreSQL con las siguientes tablas principales:

1. **estados**: Catálogo de estados de México
2. **municipios**: Catálogo de municipios con relación a estados
3. **ciudades**: Ciudades importantes con relación a estados
4. **tipos_asentamiento**: Catálogo de tipos de asentamiento (colonia, barrio, etc.)
5. **zonas**: Clasificación de zonas (Urbana, Rural, Semiurbana)
6. **codigos_postales**: Tabla principal con todos los códigos postales y sus relaciones

Las consultas las ejecutan funciones PL/pgSQL definidas en el repositorio de base de datos, no SQL embebido en la API.

## Proyecto Relacionado

Esta API utiliza la base de datos estructurada en el proyecto:

<a href="https://github.com/hkxdv/sepomex-psql-db">
  <img src="https://img.shields.io/badge/-sepomex--psql--db-000000?style=for-the-badge&logo=github&labelColor=282c34" style="border-radius: 3px;" />
</a>

La base de datos proporciona:

- Estructura optimizada en PostgreSQL
- Funciones PL/pgSQL para las consultas
- Scripts de importación de datos
- Datos completos de códigos postales de México

## Licencia

MIT &copy; Gera Schz.
