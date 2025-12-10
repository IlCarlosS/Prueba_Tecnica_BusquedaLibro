/**
 * Define la estructura de los filtros de búsqueda utilizados en el Books Store 
 * y sincronizados con la URL.
 */
export interface BookFilters {
  title: string;
  author: string;
  startYear: number | null; 
  endYear: number | null;   
  page: number;
  limit: number;
}

/**
 * Define la estructura de un objeto Libro simplificado, 
 * mapeado desde la respuesta de la Open Library API.
 */
export interface Book {
  key: string;
  title: string;
  author_name: string[]; 
  first_publish_year: number;
}