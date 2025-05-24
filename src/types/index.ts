// Interfaces Base de Datos
interface BaseEntity {
   codigo_estado: string;
}

export interface Estado extends BaseEntity {
   nombre_estado: string;
}

export interface Municipio extends BaseEntity {
   codigo_municipio: string;
   nombre_municipio: string;
}

export interface Ciudad extends BaseEntity {
   codigo_ciudad: string;
   nombre_ciudad: string;
}

export interface CodigoPostal extends BaseEntity {
   codigo_postal: string;
   nombre_asentamiento: string;
   codigo_tipo_asentamiento: string;
   codigo_municipio: string;
   codigo_ciudad?: string;
   id_zona?: number;
}

export interface StateController {
   Params: { id: string };
   GetAllReturn: Promise<ApiResponse<Estado[]>>;
   GetByIdReturn: Promise<ApiResponse<Estado> | { success: false; message: string }>;
   GetCitiesReturn: Promise<ApiResponse<Pick<Ciudad, 'codigo_ciudad' | 'nombre_ciudad'>[]>>;
   GetMunicipiosReturn: Promise<ApiResponse<Pick<Municipio, 'codigo_municipio' | 'nombre_municipio'>[]>>;
   GetAsentamientosReturn: Promise<
      ApiResponse<{ nombre_asentamiento: string; nombre_tipo_asentamiento: string }[]>
   >;
}

export interface CitiesController {
   Params: { estado: string; ciudad: string };
   GetAllReturn: Promise<ApiResponse<(Ciudad & { nombre_estado: string })[]>>;
   GetByIdReturn: Promise<
      ApiResponse<Ciudad & { nombre_estado: string }> | { success: false; message: string }
   >;
   GetColoniasReturn: Promise<
      ApiResponse<
         {
            nombre_asentamiento: string;
            nombre_tipo_asentamiento: string;
            tipo_zona: string;
         }[]
      >
   >;
   GetPostalCodesReturn: Promise<ApiResponse<{ codigo_postal: string }[]>>;
}

export interface PostalController {
   SearchQuery: { q: string };
   PostalParams: { codigo: string };
   LocationParams: {
      id?: string;
      estado?: string;
      municipio?: string;
      ciudad?: string;
   };
   PostalCodeRecord: CodigoPostal & {
      nombre_estado?: string;
      nombre_municipio?: string;
      nombre_ciudad?: string;
      nombre_tipo_asentamiento?: string;
      tipo_zona?: string;
   };
   SearchByNameReturn: Promise<ApiResponse<this['PostalCodeRecord'][]>>;
   GetByPostalCodeReturn: Promise<ApiResponse<this['PostalCodeRecord'][]>>;
   GetByStateReturn: Promise<ApiResponse<this['PostalCodeRecord'][]>>;
   GetByMunicipioReturn: Promise<ApiResponse<this['PostalCodeRecord'][]>>;
   GetByCiudadReturn: Promise<ApiResponse<this['PostalCodeRecord'][]>>;
}

// Interfaces de Configuración
export interface DbConfig {
   user?: string;
   password?: string;
   host?: string;
   port?: number;
   database?: string;
   timezone?: string;
}

// Interfaz Respuesta API Global
export interface ApiResponse<T> {
   success: boolean;
   message: string;
   data?: T;
   error?: string;
}

// Añadir nuevas interfaces para respuestas API más específicas
export interface PaginatedResponse<T> extends ApiResponse<T> {
   pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
}
