import { defineStore } from 'pinia'
import type { Book, BookFilters } from '~/types/book.d';

//filtros de búsqueda
export interface BookFilters {
  title: string;
  author: string;
  //'page' y 'limit' para la paginacion
  page: number;
  limit: number; 
}

//resultado de libro de Open Library)
interface Book {
  key: string; // ID único
  title: string;
  author_name: string[]; // Open Library usa un array
  first_publish_year: number;
}

// Tipo para el estado completo del Store
interface BooksState {
  filters: BookFilters;
  results: Book[];
  totalResults: number;
  isLoading: boolean;
  error: string | null;
}

// --- Definicion del Store ---
export const useBooksStore = defineStore('books', {
  state: (): BooksState => ({
    filters: {
      title: '',
      author: '',
      startYear: null, 
      endYear: null,
      page: 1,
      limit: 10, //limite para paginación
    },
    results: [],
    totalResults: 0,
    isLoading: false,
    error: null,
  }),

  getters: {
    // Getter para obtener los filtros en un formato listo para la API/URL
    getApiParams: (state) => ({
      q: state.filters.title ? state.filters.title : '*', // q=* para búsqueda abierta si no hay título
      author: state.filters.author,
      page: state.filters.page,
      limit: state.filters.limit,
    }),
    
    // Indica si la paginación permite ir a la página anterior
    canGoBack: (state) => state.filters.page > 1,
    
    // Indica si la paginación permite ir a la página siguiente
    canGoNext: (state) => state.filters.page * state.filters.limit < state.totalResults,
  },

  actions: {
    //Acción para actualizar cualquier filtro
    updateFilter(key: keyof BookFilters, value: string | number | null) { // Aceptamos null y number
      // Aseguramos que 'page' se resetee al buscar algo nuevo
      if (key !== 'page' && key !== 'limit') {
         this.filters.page = 1;
      }
      
      // Convertir a número si es necesario, o mantener null
      const finalValue = (key === 'startYear' || key === 'endYear') && value !== null ? Number(value) : value;

      (this.filters as any)[key] = finalValue;
    },
    
    //Acción para establecer los filtros desde la URL (Sincronización de Estado)
    setFiltersFromUrl(params: Record<string, string | string[]>) {
      this.filters.title = params.title ? String(params.title) : '';
      this.filters.author = params.author ? String(params.author) : '';
      this.filters.startYear = params.startYear ? parseInt(String(params.startYear)) : null;
      this.filters.endYear = params.endYear ? parseInt(String(params.endYear)) : null;
      this.filters.page = params.page ? parseInt(String(params.page)) : 1;
      this.filters.limit = params.limit ? parseInt(String(params.limit)) : 10;
    },
    
    //Accion para manejar la paginacion
    goToPage(page: number) {
        if (page > 0) {
            this.updateFilter('page', page);
        }
    },

    //accion para consumir la API
    async fetchBooks() {
        // Importamos dinmicamente para evitar dependencias circulares:
        const { useOpenLibraryApi } = await import('~/composables/useOpenLibraryApi'); 
        // Obtenemos la función de llamada a la API
        const { fetchBooks: apiFetchBooks } = useOpenLibraryApi();
        // Ejecutamos la lógica que ahora está en el composable
        await apiFetchBooks();
    }
  },
})