<script setup lang="ts">
// Aplicamos el middleware 'auth'. 
// middleware: si NO autenticado, redirige a /login.
definePageMeta({
  middleware: ['auth'] 
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-xl text-gray-700">Redirigiendo...</p>
  </div>
</template>