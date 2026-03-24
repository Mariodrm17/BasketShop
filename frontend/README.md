# ProductOS — Frontend Svelte 5

Frontend SPA en **Svelte 5** con **Vite** que consume la API REST del backend Node.js/Express.

## 🚀 Instalación y ejecución

```bash
# 1. Entrar al directorio
cd frontend

# 2. Instalar dependencias
npm install

# 3. Arrancar en modo desarrollo (requiere backend en http://localhost:3000)
npm run dev

# 4. Build de producción
npm run build
```

El frontend corre en `http://localhost:5173` y hace proxy de `/api` → `http://localhost:3000`.

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── ConfirmDialog.svelte   # Modal de confirmación destructiva
│   ├── Navbar.svelte          # Barra de navegación sticky
│   ├── ProductCard.svelte     # Tarjeta de producto con acciones admin
│   ├── ProductModal.svelte    # Modal crear/editar producto
│   ├── Toast.svelte           # Sistema de notificaciones
│   ├── UserModal.svelte       # Modal crear/editar usuario
│   └── UserRow.svelte         # Fila de usuario en lista
├── pages/
│   ├── Login.svelte           # Pantalla de login
│   ├── Perfil.svelte          # Perfil del usuario autenticado
│   ├── Productos.svelte       # Listado + CRUD de productos
│   └── Usuarios.svelte        # Gestión de usuarios (solo admin)
├── services/
│   └── api.js                 # Todas las llamadas al backend
├── stores/
│   ├── auth.svelte.js         # Estado global de autenticación
│   └── toast.svelte.js        # Estado global de notificaciones
├── App.svelte                 # Raíz: routing SPA + estilos globales
└── main.js                    # Punto de entrada
```

---

## ⚡ Runas de Svelte 5 utilizadas

| Runa | Dónde | Para qué |
|---|---|---|
| `$state()` | `auth.svelte.js`, `toast.svelte.js`, todas las páginas | Estado reactivo del token, usuario, listas de datos, flags de loading/error, campos de formulario |
| `$derived()` | `auth.svelte.js`, `Productos.svelte`, `Usuarios.svelte` | `isAuthenticated`, `isAdmin`, `filtered` (lista filtrada), `stats` (contadores calculados) |
| `$effect()` | `App.svelte`, `Productos.svelte`, `Usuarios.svelte` | Redirección automática si no autenticado, carga de datos al montar, sincronización de roles |
| `$props()` | Todos los componentes | Props tipadas en `ProductCard`, `ProductModal`, `UserRow`, `UserModal`, `Navbar`, etc. |
| `$bindable()` | `Navbar.svelte` | `currentPage` vinculado bidireccionalmente desde `App.svelte` |

---

## 🔌 Endpoints del backend utilizados

| Método | Ruta | Rol mínimo | Uso |
|---|---|---|---|
| `POST` | `/api/login` | — | Login, obtiene JWT |
| `POST` | `/api/register` | — | Registro |
| `GET` | `/api/productos` | user/admin | Listar productos |
| `POST` | `/api/productos` | admin | Crear producto (multipart) |
| `PUT` | `/api/productos/:id` | admin | Editar producto |
| `DELETE` | `/api/productos/:id` | admin | Eliminar producto |
| `GET` | `/api/users` | admin | Listar usuarios |
| `POST` | `/api/users` | admin | Crear usuario |
| `PUT` | `/api/users/:id` | admin | Editar usuario |
| `DELETE` | `/api/users/:id` | admin | Eliminar usuario |

---

## 🎨 Diseño

- **Tipografía**: Bebas Neue (títulos) + DM Sans (body) + JetBrains Mono (código/badges)
- **Paleta**: Dark premium con accent violeta (#8b5cf6)
- **Responsive**: Grid adaptativo + Tab bar mobile
- **Animaciones**: CSS keyframes, transiciones suaves
- **UX**: Skeletons de carga, estados vacíos, confirmación antes de acciones destructivas, toasts de feedback

---

## 👤 Credenciales de prueba

```
admin / admin123   → rol admin (CRUD completo + gestión usuarios)
user  / user123    → rol user  (solo lectura)
```
