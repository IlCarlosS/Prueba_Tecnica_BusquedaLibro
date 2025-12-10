import { defineStore } from 'pinia'

//interfaz para el estado
interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

export const useAuthStore = defineStore('auth', {
  // Estado inicial
  state: (): AuthState => ({
    isAuthenticated: false,
    email: null,
  }),
  
  // Getters para acceder fácilmente al estado
  getters: {
    // Si no está autenticado (para Middlewares)
    isGuest: (state) => !state.isAuthenticated, 
  },
  
  //de inicio sesion
  actions: {
    login(email: string, password: string) {
      if (email && password) {
        this.isAuthenticated = true;
        this.email = email;
        return true;
      }
      return false;
    },
    
    //cerrar sesion
    logout() {
      this.isAuthenticated = false;
      this.email = null;
      const router = useRouter();
      router.push('/login');
    }
  },
})