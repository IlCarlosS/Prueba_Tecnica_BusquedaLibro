<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { ref } from 'vue';

//layout 'auth' para esta página
definePageMeta({
  layout: 'auth',
  //redirigir si el usuario ya está logueado
  middleware: ['auth'] 
})

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const isLoading = ref(false);

//TOAST
const toast = ref({
  isVisible: false,
  message: '',
  type: 'success' as 'success' | 'warning' | 'error'
});
let toastTimeout: number | null = null; // Para controlar el cierre automático

//MOSTRAR EL TOAST
const showToast = (message: string, type: 'success' | 'warning' | 'error') => {
  //Limpiar timeout anterior
  if (toastTimeout !== null) {
    clearTimeout(toastTimeout);
  }
  //Mostrar mensaje
  toast.value.message = message;
  toast.value.type = type;
  toast.value.isVisible = true;
  
  //cierre automático después de 3 segundos
  toastTimeout = setTimeout(() => {
    toast.value.isVisible = false;
    toastTimeout = null;
  }, 3000);
}

const handleLogin = () => {
  isLoading.value = true;
  
  if (!email.value || !password.value) {
    showToast('Por favor, llena el formulario', 'warning');
    isLoading.value = false;
    return;
  }
  
  try {
    const success = authStore.login(email.value, password.value);
    
    if (success) {
      //Toast de exito
      showToast('Inicio de sesión correcto', 'success');
      //Manejar la redirección despues del toast (0.5 segundos)
      setTimeout(() => {
        navigateTo('/dashboard');
      }, 500); 
      
    } else {
      showToast('Error al iniciar sesión', 'error'); //dificil que suceda
    }

  } catch (error) {
    showToast('Error al iniciar sesión', 'error');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col md:flex-row max-w-4xl w-full md:h-[600px] shadow-2xl rounded-xl overflow-hidden">
    
    <div class="w-full md:w-1/2 bg-gray-800 text-white flex flex-col justify-center items-center p-8 py-10">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class=" w-12 h-12 icon icon-tabler icons-tabler-filled icon-tabler-flame text-red-500"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 2c0 -.88 1.056 -1.331 1.692 -.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08 .174l.012 .003c.625 .133 1.203 -.43 2.303 -2.173l.14 -.224a1 1 0 0 1 1.582 -.153c1.334 1.435 2.601 4.377 2.601 6.27c0 4.265 -3.591 7.705 -8 7.705s-8 -3.44 -8 -7.706c0 -2.252 1.022 -4.716 2.632 -6.301l.605 -.589c.241 -.236 .434 -.43 .618 -.624c1.43 -1.512 2.145 -2.924 2.145 -4.78" /></svg>
      <svg class="w-28 h-28 mb-4 text-indigo-500 icon icon-tabler icons-tabler-outline icon-tabler-vocabulary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 19h-6a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1h6a2 2 0 0 1 2 2a2 2 0 0 1 2 -2h6a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-6a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2z" /><path d="M12 5v16" /><path d="M7 7h1" /><path d="M7 11h1" /><path d="M16 7h1" /><path d="M16 11h1" /><path d="M16 15h1" /></svg>
      <h2 class="text-2xl font-light mt-4 tracking-wider">Biblioteca: Jaula del conocimiento</h2>
    </div>

    <div class="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center p-8 md:p-12">
      <h3 class="text-3xl font-semibold mb-8 text-gray-700">Iniciar Sesión</h3>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="sr-only">Correo</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              required
              placeholder="Correo"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="password" class="sr-only">Contraseña</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              id="password" 
              type="password" 
              v-model="password" 
              required
              placeholder="Contraseña"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <button 
          type="submit" :disabled="isLoading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          <svg v-if="!isLoading" class="h-5 w-5 mr-2 icon icon-tabler icons-tabler-outline icon-tabler-login-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M3 12h13l-3 -3" /><path d="M13 15l3 -3" /></svg>
          {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </div>

  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform opacity-0 translate-y-full"
    enter-to-class="transform opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform opacity-100 translate-y-0"
    leave-to-class="transform opacity-0 translate-y-full"
  >
    <div 
      v-if="toast.isVisible" 
      :class="{
        'bg-green-600': toast.type === 'success',
        'bg-yellow-600': toast.type === 'warning',
        'bg-red-600': toast.type === 'error',
      }"
      class="fixed bottom-5 right-5 text-white px-4 py-2 rounded-md shadow-xl z-50 transition-all"
    >
      {{ toast.message }}
    </div>
  </Transition>
</template>