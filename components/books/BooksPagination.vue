<script setup lang="ts">
import { useBooksStore } from '~/stores/books';
import { computed } from 'vue';

//--Uso del Store
const booksStore = useBooksStore();

//-- Calculos de Paginacin
const totalPages = computed(() => {
  if (booksStore.totalResults === 0 || booksStore.filters.limit === 0) {
    return 1;
  }
  return Math.ceil(booksStore.totalResults / booksStore.filters.limit);
});

// Calcul el rango de paginas visibles
const visiblePages = computed(() => {
  const current = booksStore.filters.page;
  const total = totalPages.value;
  // La limitacion visual (3 o 5)
  const pages: number[] = [];

  for (let i = 1; i <= total; i++) {
    pages.push(i);
  }
  //Lógica para centrar las páginas visibles alrededor de la página actual
  const maxPages = 5; // Máximo de páginas a mostrar (luego reduciremos a 3 en móvil)
  let start = Math.max(1, current - Math.floor(maxPages / 2));
  let end = Math.min(total, start + maxPages - 1);

  //muestra el numero maximo si es posible
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }

  //Generar el array final
  const finalPages: number[] = [];
  for (let i = start; i <= end; i++) {
    finalPages.push(i);
  }
  return finalPages;
});

//---Manejo de Acciones
const goToPage = (page: number) => {
  // La acción goToPage en el store actualiza filters.page.
  // El watch en dashboard.vue se encarga de llamar a la API y actualizar la URL.
  booksStore.goToPage(page);
};
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center space-x-1 md:space-x-2 py-4">
    <button 
      @click="goToPage(booksStore.filters.page - 1)"
      :disabled="!booksStore.canGoBack || booksStore.isLoading"
      class="px-2 md:px-4 py-2 border rounded-lg text-sm font-medium transition duration-150 flex items-center"
      :class="{
        'bg-indigo-600 text-white hover:bg-indigo-700': booksStore.canGoBack,
        'bg-gray-100 text-gray-400 cursor-not-allowed': !booksStore.canGoBack || booksStore.isLoading
      }"
    >
      <svg class="w-5 h-5 md:hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
      <span class="hidden md:block">Anterior</span>
    </button>

    <span v-if="visiblePages[0] > 1" class="px-1 text-gray-500 hidden md:inline">...</span>

    <template v-for="page in visiblePages" :key="page">
        <button 
            v-if="page <= visiblePages[0] + 2 || booksStore.filters.page === page || page > visiblePages[visiblePages.length-1] - (5 - 3) || booksStore.filters.page < 3 || visiblePages.indexOf(page) < 3 || visiblePages.length <= 3 || page === visiblePages[0] || page === visiblePages[visiblePages.length-1]"
            @click="goToPage(page)"
            :disabled="booksStore.isLoading"
            class="px-3 py-2 md:px-4 md:py-2 border rounded-lg text-sm font-medium transition duration-150"
            :class="{
                'bg-indigo-500 text-white shadow-md': page === booksStore.filters.page,
                'bg-white text-gray-700 hover:bg-gray-100': page !== booksStore.filters.page,
                'cursor-not-allowed opacity-50': booksStore.isLoading,
                'hidden sm:block': visiblePages.indexOf(page) >= 3 && visiblePages.length > 3 // Ocultar botones 4 y 5 en SM
            }"
        >
            {{ page }}
        </button>
    </template>


    <span v-if="visiblePages[visiblePages.length - 1] < totalPages" class="px-1 text-gray-500 hidden md:inline">...</span>

    <button 
      @click="goToPage(booksStore.filters.page + 1)"
      :disabled="!booksStore.canGoNext || booksStore.isLoading"
      class="px-2 md:px-4 py-2 border rounded-lg text-sm font-medium transition duration-150 flex items-center"
       :class="{
        'bg-indigo-600 text-white hover:bg-indigo-700': booksStore.canGoNext,
        'bg-gray-100 text-gray-400 cursor-not-allowed': !booksStore.canGoNext || booksStore.isLoading
      }"
    >
      <span class="hidden md:block">Siguiente</span>
      <svg class="w-5 h-5 md:hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
    </button>
  </div>
</template>