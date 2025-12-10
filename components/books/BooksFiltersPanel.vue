<script setup lang="ts">
import { useBooksStore } from '~/stores/books';
import { computed } from 'vue';

//componente notifica al dashboard cuando el usuario quiere buscar.
const emit = defineEmits(['search']);

//Uso del Store
const booksStore = useBooksStore();

//Variables Reactivas (v-model)
// Usamos propiedades computadas con getter/setter para enlazar directamente 
// los campos de entrada al estado de Pinia, manteniendo la reactividad.

const searchTitle = computed({
    get: () => booksStore.filters.title,
    set: (value: string) => booksStore.updateFilter('title', value)
});

const searchAuthor = computed({
    get: () => booksStore.filters.author,
    set: (value: string) => booksStore.updateFilter('author', value)
});

const startYear = computed({
    get: () => booksStore.filters.startYear,
    set: (value: string | number) => {
        //null si el campo está vacío para no enviar 0 a la URL
        const numValue = value === '' ? null : Number(value);
        booksStore.updateFilter('startYear', numValue);
    }
});

const endYear = computed({
    get: () => booksStore.filters.endYear,
    set: (value: string | number) => {
        const numValue = value === '' ? null : Number(value);
        booksStore.updateFilter('endYear', numValue);
    }
});

//Manejo del Formulario
const handleSubmit = () => {
    //Cuando el formulario se envía, se crea un evento.
    //dashboard.vue es responsable de llamar a la API y sincronizar la URL.
    emit('search');
}

//limpiar los filtros
const clearFilters = () => {
    booksStore.updateFilter('title', '');
    booksStore.updateFilter('author', '');
    booksStore.updateFilter('startYear', null);
    booksStore.updateFilter('endYear', null);   
    handleSubmit();
}
</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 class="text-xl font-semibold mb-4 text-gray-700">Filtros de Búsqueda</h3>
        
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"> 
            <div class="col-span-1 md:col-span-2">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                    type="text" 
                    id="title" 
                    v-model="searchTitle"
                    placeholder="Escribe el título"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
            </div>

            <div class="col-span-1">
                <label for="author" class="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input 
                    type="text" 
                    id="author" 
                    v-model="searchAuthor"
                    placeholder="Escribe el autor"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
            </div>

            <div class="col-span-1">
                <label for="startYear" class="block text-sm font-medium text-gray-700 mb-1">Año Desde</label>
                <input 
                    type="number" 
                    id="startYear" 
                    v-model="startYear"
                    placeholder="Ej: 1950"
                    min="1000"
                    :max="new Date().getFullYear()"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
            </div>

            <div class="col-span-1">
                <label for="endYear" class="block text-sm font-medium text-gray-700 mb-1">Año Hasta</label>
                <input 
                    type="number" 
                    id="endYear" 
                    v-model="endYear"
                    placeholder="Ej: 2024"
                    min="1000"
                    :max="new Date().getFullYear()"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
            </div>

            <div class="col-span-1 md:col-span-5 flex justify-end space-x-2 mt-4 md:mt-0"> 
                <button 
                    type="submit"
                    :disabled="booksStore.isLoading"
                    class="flex-shrink-0 w-auto inline-flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                    Buscar
                </button>
                
                <button 
                    type="button" 
                    @click="clearFilters"
                    class="flex-shrink-0 inline-flex justify-center items-center py-2 px-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg class=" h-5 w-5 icon icon-tabler icons-tabler-outline icon-tabler-clear-all" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 6h12" /><path d="M6 12h12" /><path d="M4 18h12" /></svg>
                </button>
            </div>
        </form>
    </div>
</template>