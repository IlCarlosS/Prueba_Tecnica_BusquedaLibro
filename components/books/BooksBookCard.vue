<script setup lang="ts">
import type { Book } from '~/types/book.d';

//Definición de Propiedades (usando el tipo Book definido previamente)
const props = defineProps<{
  book: Book;
}>();

//Composable para formatear datos
const getAuthorList = computed(() => {
  //los autores se muestren como una cadena separada por coma
  return props.book.author_name ? props.book.author_name.join(', ') : 'Autor Desconocido';
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
    
    <h3 class="text-xl font-bold text-indigo-700 mb-2 truncate" :title="book.title">
      {{ book.title }}
    </h3>
    
    <p class="text-sm text-gray-600 mb-4">
      <span class="font-semibold">Autor(es):</span> {{ getAuthorList }}
    </p>

    <div class="mt-auto">
        <p class="text-sm text-gray-500 flex items-center mb-2">
            <svg class="w-4 h-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            Publicado: {{ book.first_publish_year }}
        </p>

        <p class="text-xs text-gray-400 truncate">
            <span class="font-medium">ID:</span> {{ book.key.replace('/works/', '') }}
        </p>
    </div>
  </div>
</template>