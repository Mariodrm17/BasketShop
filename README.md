# BasketShop - Progra Web

Esta aplicación es una Single Page Application (SPA) construida con **Svelte 5** (utilizando Vite) como frontend, y un backend preexistente construido en **Node.js** con Express y MongoDB. Se conecta todo el stack mediante **Docker Compose**.

La práctica cubre el 100% de los requisitos solicitados en la rúbrica y añade los extras de persistencia y Carrito.

## Despliegue y Ejecución

El proyecto está dockerizado para evitar problemas de compatibilidad y dependencias.
Para levantar tanto la base de datos (MongoDB, Redis) como los servidores Backend y Frontend, sitúate en la raíz del proyecto y ejecuta:

```bash
docker compose up -d --build
```

- El **Frontend (Svelte)** estará corriendo en [http://localhost:5173](http://localhost:5173)
- El **Backend (API)** estará corriendo en `http://localhost:3000`

Para ver los registros en tiempo real:
```bash
docker compose logs -f
```

## Credenciales por Defecto

El backend expone un script de limpieza llamado `seed.js` que en Docker instancia dos perfiles por defecto:
- Rol Administrador: `admin` | `admin123`
- Rol Usuario Básico: `user` | `user123`

## Partes del Backend Utilizadas

Para el frontend consumimos los siguientes endpoints de la API (definidos en las rutas):

**Auth (JWT):**
- `POST /api/login`: Inicio de sesión, devuelve token.
- `POST /api/register`: Registro de un nuevo usuario con permisos por defecto de `user`.

**Productos (CRUD - Roles):**
- `GET /api/productos`: Lista los productos (y filtra). Accesible públicamente o por cualquier usuario.
- `POST /api/productos`: Crea un producto. Privado (Solo **admin**).
- `PUT /api/productos/:id`: Edita datos y URL de imagen de un producto. Privado (**admin**).
- `DELETE /api/productos/:id`: Borra un producto del catálogo. Privado (**admin**).

**Usuarios (CRUD - Admin):**
- `GET /api/users`: Listado completo de usuarios del sistema. Privado (**admin**).
- `POST /api/users`: Alta directa de perfiles (puede elegir el rol manualmente). Privado (**admin**).
- `PUT /api/users/:id`: Edición y modificación del `role` (Admin/User). Privado (**admin**).
- `DELETE /api/users/:id`: Dar de baja un usuario. Privado (**admin**).

**Carrito:**
- `GET /api/cart`: Permite visualizar la lista de la compra del usuario autenticado. Privado.
- `POST /api/cart/add`: Añade cantidad a un ítem existente o pushea un objeto nuevo al carro. Privado.
- `DELETE /api/cart/:productId`: Elimina de un golpe el item especificado. Privado.

## Nuevas Herramientas Svelte 5 (Runes)

La aplicación **no usa las variables reactivas clásicas** de Svelte 3/4. Adopta íntegramente el sistema de Runes de `Svelte 5`.

1. **Estado (`$state`)**
   - Utilizado en todos los componentes para controlar datos variables locales como los modales (`showModal`), peticiones iterativas (`loading`), objetos base (`username`, `password`) y la colección local cargada de la API (`productos`, `users`, `cart`).
   - Almacena de manera global el estado de sesión (`token` de JWT).
2. **Derivados (`$derived`)**
   - Crea filtros automáticos, estadísticos (número de admins o usuarios extraídos automáticamente) u otras variables computadas de solo lectura.
   - En `auth.svelte.js` se define si alguien es *admin* computando `$derived(user?.role === 'admin')`, evitando recalcular el JWT o generar lógica duplicada en las UI.
   - En el `Carrito` calcula automáticamente el precio *Total* basándose en la lista iterativa `$derived(cart.reduce(...))`.
3. **Efectos (`$effect`)**
   - Sincroniza al usuario entre pantallas, expulsando a quienes intenten entrar por URL directa `/usuarios` si no tienen credenciales de administrador (redireccionando reactivamente).
   - Engancha funciones de API asíncronas (`loadProductos()`) de modo que recojan los datos cada vez que detecten que la API o el usuario (`auth.isAuthenticated`) fue mutada.
4. **Props (`$props()`)**
   - Enlaza padres (Listas, Cards) con los Modales interactivos pasándole los objetos (`producto`, `user`), además de las funciones callbacks como `onClose`, `onSaved`, y `onView` para simplificar la gestión.

## Persistencia Avanzada
Se ha cumplido con el requisito opcional de Ampliación de Persistir sesión: el store de Autenticación se engancha con el `localStorage` en `auth.svelte.js`. Al refrescar la página de Svelte, comprobará inmediatamente la presencia de tokens, y la persona se levantará donde paró.