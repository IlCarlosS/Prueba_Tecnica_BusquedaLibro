<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useBooksStore } from '~/stores/books';
import { useOpenLibraryApi } from '~/composables/useOpenLibraryApi';
import { onMounted, watch } from 'vue';

// ---Configuración de la página y Middleware
definePageMeta({
  layout: 'default',
  middleware: ['auth'] 
});

// --- Composable, Stores y Router
const authStore = useAuthStore();
const booksStore = useBooksStore();
const { fetchBooks } = useOpenLibraryApi();
const router = useRouter();
const route = useRoute(); // leer los query params

// --- Logica: Sincronización de URL y Estado (Requisito Vital)

//Lee los query params de la URL y actualiza el estado de Pinia
const syncUrlToStore = () => {
  booksStore.setFiltersFromUrl(route.query as Record<string, string>);
};

/**
 * Actualiza la URL con los filtros actuales del Store.
 * @param searchTriggered Indica si se debe forzar una nueva búsqueda
 */
const syncStoreToUrl = (searchTriggered: boolean = true) => {
    const filters = booksStore.filters;
    const query = {
        title: filters.title || undefined, // Evita que se muestren params vacíos en la URL
        author: filters.author || undefined,
        page: filters.page > 1 ? filters.page.toString() : undefined,
        limit: filters.limit !== 10 ? filters.limit.toString() : undefined,
    };
    
    // Solo actualiza la URL si los query params cambiaron
    if (JSON.stringify(query) !== JSON.stringify(route.query)) {
        router.push({ query: query });
    }
    
    // Disparar la búsqueda si fue requerido (ej. cambio de página o envío de formulario)
    if (searchTriggered) {
        fetchBooks();
    }
};

// ---Observadores y Montaje
watch(() => booksStore.filters, () => {
    syncStoreToUrl(true); // Actualiza URL y dispara la búsqueda
}, { deep: true });


onMounted(() => {
    syncUrlToStore();//lee la URL para restaurar filtros (si existen)
    fetchBooks(); //Inicia la primera búsqueda con los filtros (de la URL o por defecto)
});

//--- Funcin de cerrar sesion
const handleLogout = () => {
    authStore.logout(); // Redirige a /login
}

//--Funcion de Busqueda
const handleSearch = () => {
    //la pagina se resetee a 1 en la busqueda.
    if (booksStore.filters.page !== 1) {
        booksStore.updateFilter('page', 1);
    } else {
        syncStoreToUrl(true);// El watch se dispara y llama a syncStoreToUrl(true)
    }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Búsqueda de Libros</h1>

    <div class="flex justify-between items-center mb-6 p-4 bg-white shadow rounded-lg">
        <p class="text-m text-gray-600">Bienvenido: <span class="font-medium text-indigo-600">{{ authStore.email }}</span></p>
        <button @click="handleLogout" class="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          <svg class="h-5 w-5 mr-2 icon icon-tabler icons-tabler-outline icon-tabler-logout-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M15 12h-12l3 -3" /><path d="M6 15l-3 -3" /></svg>
          Cerrar Sesión</button>
    </div>

    <BooksFiltersPanel @search="handleSearch" class="mb-8" /> 

    <div class="mt-8">
      <div v-if="booksStore.isLoading" class="text-center p-10">
        <p class="text-indigo-600 font-semibold flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Cargando libros...
        </p>
      </div>

      <div v-else-if="booksStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <p class="font-bold">Error de Carga</p>
        <p>{{ booksStore.error }}</p>
      </div>
      
      <div v-else-if="booksStore.results.length === 0" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
        <p class="font-bold">No se encontraron resultados</p>
        <p>Intenta con otra palabra clave o autor.</p>
      </div>

      <div v-else>
        <p class="text-sm text-gray-600 mb-4">Mostrando {{ booksStore.results.length }} de {{ booksStore.totalResults }} resultados.</p>
        
        <TransitionGroup name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BooksBookCard 
            v-for="book in booksStore.results" 
            :key="book.key" 
            :book="book"
          />
        </TransitionGroup>

        <div class="mt-8">
          <BooksPagination />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease; 
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px); 
}
.list-leave-active {
  position: absolute;
}
</style>