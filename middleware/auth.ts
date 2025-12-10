import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // LLAMAR al store DENTRO de la funcion del middleware
  const authStore = useAuthStore(); 
  
  if (to.path !== '/login' && authStore.isGuest) {
    return navigateTo('/login'); 
  }
  
  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo('/dashboard');
  }
})