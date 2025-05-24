# SEPOMEX API REST

API REST desarrollada con Bun y Elysia para consultar la base de datos de códigos postales de México (SEPOMEX).

<div align="center">
  <img src="https://img.shields.io/badge/-Bun-000000?style=for-the-badge&logo=bun&labelColor=282c34" style="border-radius: 3px;" />
  <img src="https://img.shields.io/badge/-Elysia-000000?style=for-the-badge&logo=elysia&labelColor=282c34" style="border-radius: 3px;" />
  <img src="https://img.shields.io/badge/-Biome-000000?style=for-the-badge&logo=biome&labelColor=282c34" style="border-radius: 3px;" />
  <img src="https://img.shields.io/badge/-Postman-000000?style=for-the-badge&logo=postman&labelColor=282c34" style="border-radius: 3px;" />
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
- Base de datos PostgreSQL con datos de SEPOMEX
- Postman (opcional, para pruebas)

### Clonar el repositorio

```bash
git clone https://github.com/hkxdv/sepomex-api-rest.git
cd sepomex-api-rest
```

### Instalar dependencias

```bash
bun install
```

### Configurar variables de entorno

```bash
cp .env.example
```

> [!IMPORTANT]
> Es necesario configurar correctamente las variables de entorno, especialmente las credenciales de la base de datos PostgreSQL.

### Iniciar el servidor

```bash
bun dev
```

## Uso y endpoints

Ejemplos de los principales endpoints:

### Búsqueda por nombre de asentamiento

```http
GET /api/v1/postal/search?q=centro
```

### Búsqueda por código postal

```http
GET /api/v1/postal/codigo/29000
```

### Filtrar por estado

```http
GET /api/v1/postal/estado/07
```

### Filtrar por estado y municipio

```http
GET /api/v1/postal/estado/07/municipio/101
```

Consulta el archivo `docs/endpoints.md` para ver todos los endpoints disponibles.

> [!WARNING]
>
> - Los datos pueden contener errores tipográficos
> - No se garantiza la actualización en tiempo real
> - Para uso oficial, se recomienda consultar directamente con SEPOMEX
> - Este proyecto es una implementación de referencia y educativa

## Estructura de los datos

La API consume una base de datos PostgreSQL con las siguientes tablas principales:

1. **estados**: Catálogo de estados de México
2. **municipios**: Catálogo de municipios con relación a estados
3. **ciudades**: Ciudades importantes con relación a estados
4. **tipos_asentamiento**: Catálogo de tipos de asentamiento (colonia, barrio, etc.)
5. **zonas**: Clasificación de zonas (Urbana, Rural, Semiurbana)
6. **codigos_postales**: Tabla principal con todos los códigos postales y sus relaciones

Para más detalles sobre la estructura de la base de datos, consulta el proyecto relacionado.

## Proyecto Relacionado

Esta API utiliza la base de datos estructurada en el proyecto:

<a href="https://github.com/hkxdv/sepomex-psql-db">
  <img src="https://img.shields.io/badge/-sepomex--psql--db-000000?style=for-the-badge&logo=github&labelColor=282c34" style="border-radius: 3px;" />
</a>

La base de datos proporciona:

- Estructura optimizada en PostgreSQL
- Scripts de importación de datos
- Consultas SQL de ejemplo
- Datos completos de códigos postales de México

## Licencia

MIT &copy; Gera Schz.
