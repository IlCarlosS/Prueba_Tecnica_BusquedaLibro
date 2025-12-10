import { useBooksStore } from '~/stores/books';
import type { BookFilters } from '~/stores/books'; // Importamos la interfaz
import type { Book, BookFilters } from '~/types/book.d';

// URL base de la API de Open Library
const API_BASE_URL = 'https://openlibrary.org';

// Tipos internos para mapear la respuesta de la API (simplificado)
interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: number;
}
interface OpenLibraryResponse {
  numFound: number; // Total de resultados
  docs: OpenLibraryDoc[];
}

export const useOpenLibraryApi = () => {
  const booksStore = useBooksStore();
  
  /**
   * parámetros de la API a partir de los filtros del Store.
   * @param filters Los filtros del Books Store.
   * @returns Un objeto de parámetros apto para la URL.
   */
    const buildParams = (filters: BookFilters) => {
    let q = '';
    
    //Añadir Título y Autor a la query 'q'
    if (filters.title) {
        q += filters.title;
    }

    if (filters.author) {
        q += (q ? ' AND ' : '') + 'author:' + filters.author;
    }

    //FILTRO DE AÑO a la query 'q'
    const startYear = filters.startYear || 0; // 0 como inicio por defecto
    const endYear = filters.endYear || new Date().getFullYear();

    if (filters.startYear || filters.endYear) {
        // Formato: first_publish_year:[start TO end]
        const yearQuery = `first_publish_year:[${startYear} TO ${endYear}]`;
        q += (q ? ' AND ' : '') + yearQuery;
    }
    if (!q) { // SI NO HAY NINGUN TERMINO DE BUSQUEDA RETORNAR NULL
        return null;
    }

    const params: Record<string, string | number> = {
      q: q,
      limit: filters.limit,
      page: filters.page,
      fields: 'key,title,author_name,first_publish_year', 
    };
    return params;
  };
  
  /**
   * Función principal para llamar a la API y actualizar el Books Store.
   */
  const fetchBooks = async () => {
    booksStore.isLoading = true;
    booksStore.error = null;
    booksStore.results = []; // Limpiamos resultados previos
    booksStore.totalResults = 0;
    
    //Construir los parámetros y SALIR si son nulos
    const params = buildParams(booksStore.filters);
    
    if (params === null) {
        booksStore.isLoading = false;
        return; // Salir sin llamar a la API
    }
    
    //Usar $fetch de Nuxt 3 para la llamada HTTP
    try {
      const response: OpenLibraryResponse = await $fetch(`${API_BASE_URL}/search.json`, {
        method: 'GET',
        params: params,
      });

      booksStore.totalResults = response.numFound;      
      booksStore.results = response.docs.map(doc => ({
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name || ['N/A'],
        first_publish_year: doc.first_publish_year || 'N/A',
      }));
      
    } catch (e: any) {
      booksStore.error = 'Error al consultar la API de Open Library.';
      console.error('API Error:', e);
      booksStore.results = [];
    } finally {
      booksStore.isLoading = false;
    }
  };

  return {
    fetchBooks,
  };
};