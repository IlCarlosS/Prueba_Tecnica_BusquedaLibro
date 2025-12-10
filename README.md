# Prueba Técnica Frontend: Dashboard de Búsqueda de Libros
Este proyecto implementa un dashboard de búsqueda de libros utilizando Nuxt/Vue como framework principal, Pinia para la gestión de estado y la fuente de datos es la Open Library Search API.
El desarrollo sigue una arquitectura limpia (Atomic Design y Separación de Responsabilidades) para garantizar la claridad del código, el manejo eficiente del estado y la persistencia de los filtros en la URL.

## Instrucciones de Instalación y Ejecución en entorno local
Prerrequisitos
Tener instalado Node.js (versión recomendada: 18 o superior).

Instalación de Dependencias
Ejecutar los siguiente comando para instalar las dependencias de Nuxt y Tailwind CSS:
```bash
npm install
```
Variables de Entorno: 
No se requieren variables de entorno externas (como VITE_API_KEY o NUXT_PUBLIC_API_URL), ya que la Open Library API se consume directamente desde la URL pública (https://openlibrary.org) y la lógica de autenticación es falsa y se maneja internamente.

Ejecución del Proyecto
Inicia el servidor de desarrollo:
```bash
npm run dev
```
> El proyecto estará disponible en http://localhost:3000.

## Arquitectura y Decisiones de Diseño
La arquitectura del proyecto se basa en los principios de Nuxt 3 y Pinia, enfocándose en la modularidad y la escalabilidad:

### 1. Arquitectura Elegida
* Framework: Nuxt 3 (Vue 3)
* Gestión de Estado: Pinia
* Estilos: Tailwind CSS
* Tipado: TypeScript (uso estricto en Stores, Composables y Tipos)

Se utiliza el patrón de Separación de Responsabilidades:
* stores/ (Pinia): Gestión centralizada del estado (auth.ts y books.ts).
* composables/: Encapsulan la lógica reutilizable, como la llamada a la API externa (useOpenLibraryApi.ts).
* components/: Contienen la lógica de la UI (filtros, tarjetas, paginación).

### 2. Decisiones Relevantes Implementadas
Sincronización de Estado con la URL
Decisión: El estado de los filtros (title, author, startYear, endYear, page, limit) se almacena en el stores/books.ts, pero la fuente de verdad para la persistencia es la URL.

En pages/dashboard.vue, se utiliza useRoute() para leer los query params al montar la página (onMounted) y se llama a booksStore.setFiltersFromUrl().
Se utiliza un watch sobre booksStore.filters para detectar cualquier cambio (ej. clic en paginación o entrada de filtro) y se llama a router.push() para actualizar la URL. Esto garantiza que el estado del dashboard se mantenga aunque el usuario copie y pegue la URL o recargue la página.

Filtros y Búsqueda en la Open Library API
Decisión: Evitar llamadas a la API con queries inválidas.

El composable/useOpenLibraryApi.ts valida que exista al menos un término de búsqueda (title, author, o rango de año) antes de realizar la llamada $fetch.
Filtros Implementados: Título, Autor, y Rango de Año (first_publish_year:[startYear TO endYear]) utilizando la sintaxis de búsqueda avanzada de Open Library.

Gestión de la Paginación
Decisión: El dashboard gestiona la paginación a nivel de store para que los cambios se reflejen automáticamente en la URL.
stores/books.ts expone los getters canGoBack y canGoNext.
components/books/BooksPagination.vue llama a booksStore.goToPage(n) y la actualización del page en la URL dispara automáticamente una nueva búsqueda.

### 3. Extras
* Guards de Navegación: Implementación de un middleware (auth.ts) para proteger la ruta /dashboard.
* TypeScript: Uso de tipado en interfaces y variables reactivas.
* Feedback al Usuario: Indicadores de Loading y mensajes claros para "No Resultados" y "Errores de API".
* Componentes Reutilizables: Separación de la UI en BooksFiltersPanel, BooksBookCard, y BooksPagination.
* Animaciones Sutiles: Uso de <TransitionGroup> en el listado de resultados para un fade-in/out suave al cambiar los resultados.
* Diseño Responsive: Los filtros y la paginación se adaptan a pantallas móviles (reducción de botones, uso de íconos en lugar de texto).

> Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
