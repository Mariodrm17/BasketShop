<script>
  import { auth } from '../stores/auth.svelte.js'
  import { toast } from '../stores/toast.svelte.js'

  let { currentPage = $bindable(), onLogout } = $props()

  function navigate(page) {
    currentPage = page
  }

  function handleLogout() {
    auth.clearSession()
    toast.info('Sesión cerrada')
    onLogout?.()
  }
</script>

<nav class="navbar">
  <div class="navbar__brand" onclick={() => navigate('productos')}>
    <span class="navbar__logo">🏀</span>
    <span class="navbar__name">HOOP<span>STORE</span></span>
  </div>

  <div class="navbar__links">
    <button
      class="nav-link {currentPage === 'productos' ? 'nav-link--active' : ''}"
      onclick={() => navigate('productos')}
    >
      Productos
    </button>

    <button
      class="nav-link {currentPage === 'carrito' ? 'nav-link--active' : ''}"
      onclick={() => navigate('carrito')}
    >
      Carrito 🛒
    </button>

    {#if auth.isAdmin}
      <button
        class="nav-link {currentPage === 'usuarios' ? 'nav-link--active' : ''}"
        onclick={() => navigate('usuarios')}
      >
        Usuarios
      </button>
    {/if}
  </div>

  <div class="navbar__user">
    <div class="user-pill">
      <span class="user-pill__dot {auth.isAdmin ? 'dot--admin' : 'dot--user'}"></span>
      <span class="user-pill__name">{auth.username}</span>
      <span class="user-pill__role">{auth.isAdmin ? 'admin' : 'user'}</span>
    </div>
    <button class="btn-logout" onclick={handleLogout}>
      Salir
    </button>
  </div>
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0 2rem;
    height: 64px;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .navbar__brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    text-decoration: none;
  }

  .navbar__logo {
    font-size: 1.6rem;
    color: var(--accent);
    line-height: 1;
  }

  .navbar__name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    color: var(--text-primary);
  }

  .navbar__name span {
    color: var(--accent);
  }

  .navbar__links {
    display: flex;
    gap: 0.25rem;
    flex: 1;
  }

  .nav-link {
    background: none;
    border: none;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }

  .nav-link:hover {
    color: var(--text-primary);
    background: rgba(255,255,255,0.06);
  }

  .nav-link--active {
    color: var(--accent);
    background: rgba(139, 92, 246, 0.12);
  }

  .navbar__user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.9rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
  }

  .user-pill__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot--admin {
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }

  .dot--user {
    background: var(--success);
    box-shadow: 0 0 8px var(--success);
  }

  .user-pill__name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .user-pill__role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--text-muted);
    background: rgba(255,255,255,0.06);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
  }

  .btn-logout {
    background: none;
    border: 1px solid rgba(255,255,255,0.12);
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-logout:hover {
    border-color: var(--error);
    color: var(--error);
    background: rgba(239,68,68,0.08);
  }
</style>
