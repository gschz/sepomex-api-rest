/**
 * Types aligned to v2 DB function return columns.
 * CHAR columns come back as string from pg, SMALLINT as number.
 */

// Record types — match PL/pgSQL function RETURNS exactly

export interface PostalCodeRecord {
   codigo_postal: string;
   nombre_asentamiento: string;
   tipo_asentamiento: string;
   zona: string;
   codigo_estado: string;
   nombre_estado: string;
   pk_codigo_municipio: string | null;
   nombre_municipio: string | null;
   pk_codigo_ciudad: string | null;
   nombre_ciudad: string | null;
}

export interface StateRecord {
   codigo_estado: string;
   nombre_estado: string;
}

export interface CityRecord {
   codigo_ciudad: string;
   nombre_ciudad: string;
   codigo_estado: string;
}

export interface MunicipalityRecord {
   codigo_municipio: string;
   nombre_municipio: string;
   codigo_estado: string;
}

// Controller interface contracts — keep Elysia context typing

export interface StateController {
   Params: { estado: string };
   GetAllReturn: Promise<ApiResponse<StateRecord[]>>;
   GetByIdReturn: Promise<ApiResponse<StateRecord> | { success: false; message: string }>;
   GetCitiesReturn: Promise<ApiResponse<CityRecord[]>>;
   GetMunicipiosReturn: Promise<ApiResponse<MunicipalityRecord[]>>;
   GetAsentamientosReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
}

export interface CitiesController {
   Params: { estado: string; ciudad: string };
   GetAllReturn: Promise<ApiResponse<CityRecord[]>>;
   GetByIdReturn: Promise<ApiResponse<CityRecord> | { success: false; message: string }>;
   GetColoniasReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
   GetPostalCodesReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
}

export interface PostalController {
   SearchQuery: { q: string };
   PostalParams: { codigo: string };
   LocationParams: {
      estado?: string;
      municipio?: string;
      ciudad?: string;
   };
   SearchByNameReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
   GetByPostalCodeReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
   GetByStateReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
   GetByMunicipioReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
   GetByCiudadReturn: Promise<ApiResponse<PostalCodeRecord[]>>;
}

// Config types

export interface DbConfig {
   user?: string;
   password?: string;
   host?: string;
   port?: number;
   database?: string;
   timezone?: string;
}

export interface ApiResponse<T> {
   success: boolean;
   message: string;
   data?: T;
   error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
   pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
}
