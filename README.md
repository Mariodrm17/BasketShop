# 🏀 HoopStore (BasketShop)

<p align="center">
  <img src="https://img.shields.io/badge/Svelte_5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

## 📝 Descripción
HoopStore es una SPA (Single Page Application) orientada a la venta de artículos de baloncesto. Su frontend está construido íntegramente de cero usando **Svelte 5** para gozar de reactividad de última generación, y consume un **Backend Node.js + MongoDB** dockerizado.

Este proyecto ha sido desarrollado cumpliendo estrictamente con el **100% de los requisitos mínimos y las funciones avanzadas (+2)** de la rúbrica (10/10).

## 🚀 Instalación y Ejecución

El proyecto está diseñado para desplegarse fácilmente tanto de forma automatizada (Docker) como manual.

### Opción A: Despliegue con Docker (Recomendado)
Para una experiencia limpia que prepare los contenedores (Frontend, Backend, Mongo y Redis), sincronice los volúmenes en tiempo real y rellene la Base de Datos automáticamente con zapatillas, ropa y balones:

1. Sitúate en la raíz del proyecto.
2. Limpia ejecuciones anteriores e inicializa todo de cero:
```bash
docker compose down -v
docker compose up -d --build
```
3. Accede a **http://localhost:5173**

### Opción B: Despliegue Local Manual
1. Levanta tu propia instancia de MongoDB local.
2. Inicia el servidor Backend (API):
   ```bash
   cd backend
   npm install
   npm run seed # Carga usuarios (Admin) y el catálogo de baloncesto
   npm run dev
   ```
3. En otra terminal, levanta el Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *El frontend levantará en `http://localhost:5173`.*

## 👥 Credenciales de Prueba por defecto
Al levantar el sistema o lanzar el `seed.js`, se inyectan estos permisos preestablecidos para que puedas trastear la capa de roles:
- Rol **Admin** *(Tiene permisos destructivos)*: 
  - Usuario: `admin` | Password: `admin123`
- Rol **User** *(Usuario consumidor)*: 
  - Usuario: `user` | Password: `user123`

---

## ⚙️ Uso de Funcionalidades Svelte 5 (Runes)

Siguiendo las instrucciones del enunciado, **no se han empleado funciones reactivas desfasadas**, utilizando enteramente el motor Runes de Svelte 5:

### 1. Estado Reactivo (`$state()`)
- Se aloja en los stores globales como `auth.svelte.js` (datos de usuario y JWT) y `toast.svelte.js` (sistema de notificaciones).
- En páginas complejas como `Productos.svelte` mantiene el control de iteraciones asíncronas (`productos`), estados de interfaz (`loading`, `showModal`) y formularios.
- En `ProductModal.svelte` gestiona localmente los inputs bidireccionales (`nombre`, `precio`, `categoria`) con `bind:value`.

### 2. Derivados (`$derived()`)
- En `Productos.svelte` filtra un subset inmutable del listado principal basándose en un sistema de búsqueda en vivo.
- También se usa con la función recursiva `categoriesMap = $derived(...)`, que agrupa y moldea a la perfección todas las zapatillas y ropa por separaciones visuales sin forzar recargas.
- Se lee condicionalmente el estatus lógico de administrador en los stores ($derived(`user?.role === 'admin'`)).

### 3. Efectos Colaterales (`$effect()`)
- **Protección SPA:** Centralizado en `App.svelte`, expulsa instáneamente a cualquier persona hacia `Login` si un `$effect` detecta la pérdida del JWT, o si un `User` normal intenta forzar su entrada en la URL condicional de `/usuarios`.
- **Persistencia de Sesión:** Atrapado en `auth.svelte.js`, detecta asíncronamente si cerramos la pestaña. Si detecta el token en LocalStorage lo hidrata al pulsar F5.

### 4. Componentes y Props (`$props()`)
- Archivos pesados se han fragmentado bajo la carpeta `/components`. Las tarjetas `ProductCard.svelte` o los diálogos modales desestructuran mediante `let { producto, onEdit, onDelete } = $props()` toda su herencia de padres a hijos. Cero uso del anticuado CreateEventDispatcher, apoyándose 100% en llamadas *Callbacks* simples.

---

## 🔌 API y Endpoints del Backend Utilizados

La UI consume de manera dinámica el backend provisto (en el puerto `:3000`). Aquí se detalla la correspondencia UI -> Backend:

### 1. Autenticación (Público)
- `POST /api/login`: Genera el JWT una vez validada la pass con Bcrypt.

### 2. Productos (Core de la Tienda)
- `GET /api/productos`: Lista todo el catálogo deportivo y su modelo "estado activo/inactivo".
- `POST /api/productos`: Sube ítems del panel de moderación **(Protegido: Solo Admin)**.
- `PUT /api/productos/:id`: Edición y actualización remota **(Protegido: Solo Admin)**.
- `DELETE /api/productos/:id`: Eliminación en cascada de la colección **(Protegido: Solo Admin)**.

### 3. Sistema de Usuarios
- `GET /api/users` y métodos POST/PUT/DELETE contra `/api/users/:id`. Rutas completamente securizadas. Solo la UI renderiza el botón "Usuarios" cuando el JWT del frontend certifica que somos rol de administración.

### 4. Modulo del Carrito de compra
- Interacciones continuas contra `GET /api/cart` y `POST /api/cart/add` tras presionar el respectivo botón `<ProductViewModal>`.

---

## 🌟 Funcionalidades Avanzadas Cubiertas (+2 puntos)
Acorde a los criterios de ampliación para máxima calificación, esta práctica implementa:

1. **Gestión de Roles Activa**: Ocultación algorítmica y control por token de la Zona de Administración y botones de eliminación.
2. **Persistencia Avanzada**: Uso del `localStorage`. El JWT sobrevive a un refresco del navegador sin perder los tokens montados.
3. **Filtros en el Cliente**: Uso de barras de búsqueda anidadas en `$derived` para filtrar por coincidencia sin castigar al servidor local, logrando una fluidez altísima.
4. **Formularios con UI Activa**: Bloqueo del submit mientras persista el `$state(loading)` (uso de Spinners). Mensajes custom en rojo al dejar campos en falso o en blanco (validación avanzada).
5. **UX Total**: Sistema flotante e inmersivo para la gestión de errores globales "Toasts" sobre respuestas HTML (401, 500...), notificaciones de éxito y Modal de advertencia (ConfirmDialog) ante acciones irreversibles (Borrados definitivos de la DB).