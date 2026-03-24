<script>
  import { auth } from './stores/auth.svelte.js'
  import { toast } from './stores/toast.svelte.js'
  import Toast from './components/Toast.svelte'
  import Navbar from './components/Navbar.svelte'
  import Login from './pages/Login.svelte'
  import Productos from './pages/Productos.svelte'
  import Usuarios from './pages/Usuarios.svelte'
  import Perfil from './pages/Perfil.svelte'

  // Navegación SPA
  let currentPage = $state('productos')

  // Redirigir a login si no autenticado; si no es admin, redirigir de usuarios
  $effect(() => {
    if (!auth.isAuthenticated) {
      currentPage = 'login'
    } else if (currentPage === 'login') {
      currentPage = 'productos'
    }
  })

  $effect(() => {
    if (auth.isAuthenticated && currentPage === 'usuarios' && !auth.isAdmin) {
      currentPage = 'productos'
      toast.error('Acceso denegado: solo administradores')
    }
  })

  function handleLogin() {
    currentPage = 'productos'
  }

  function handleLogout() {
    currentPage = 'login'
  }
</script>

<div class="app">
  {#if auth.isAuthenticated}
    <Navbar bind:currentPage onLogout={handleLogout} />

    <main class="main">
      {#if currentPage === 'productos'}
        <Productos />
      {:else if currentPage === 'usuarios' && auth.isAdmin}
        <Usuarios />
      {:else if currentPage === 'perfil'}
        <Perfil />
      {:else}
        <Productos />
      {/if}
    </main>

    <!-- Tab bar mobile -->
    <nav class="tab-bar">
      <button
        class="tab-item {currentPage === 'productos' ? 'tab-item--active' : ''}"
        onclick={() => currentPage = 'productos'}
      >
        <span class="tab-item__icon">⬡</span>
        <span class="tab-item__label">Productos</span>
      </button>

      {#if auth.isAdmin}
        <button
          class="tab-item {currentPage === 'usuarios' ? 'tab-item--active' : ''}"
          onclick={() => currentPage = 'usuarios'}
        >
          <span class="tab-item__icon">◎</span>
          <span class="tab-item__label">Usuarios</span>
        </button>
      {/if}

      <button
        class="tab-item {currentPage === 'perfil' ? 'tab-item--active' : ''}"
        onclick={() => currentPage = 'perfil'}
      >
        <span class="tab-item__icon">◉</span>
        <span class="tab-item__label">Perfil</span>
      </button>
    </nav>
  {:else}
    <Login onLogin={handleLogin} />
  {/if}

  <Toast />
</div>

<style>
  /* ═══════════════════════════════════════════
     GLOBAL DESIGN TOKENS
  ═══════════════════════════════════════════ */
  :global(:root) {
    /* Paleta oscura premium */
    --bg:           #09090d;
    --surface:      #111118;
    --surface-2:    #18181f;
    --border:       rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);

    /* Tipografía */
    --text-primary: #f0f0f6;
    --text-muted:   #8b8b9e;
    --text-faint:   #4a4a5a;

    /* Accent violeta vibrante */
    --accent:       #8b5cf6;
    --accent-hover: #7c3aed;

    /* Estados */
    --success:  #10b981;
    --error:    #ef4444;
    --warning:  #f59e0b;

    color-scheme: dark;
  }

  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(html) {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  :global(body) {
    background: var(--bg);
    color: var(--text-primary);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    /* Patrón de puntos ultra sutil como en el trabajo anterior */
    background-image:
      radial-gradient(circle at 20% 20%, rgba(139,92,246,0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(99,102,241,0.03) 0%, transparent 50%);
  }

  :global(input), :global(select), :global(textarea) {
    color-scheme: dark;
  }

  :global(input[type="search"]::-webkit-search-cancel-button) {
    display: none;
  }

  :global(*::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }

  :global(*::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(*::-webkit-scrollbar-thumb) {
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
  }

  :global(*::-webkit-scrollbar-thumb:hover) {
    background: rgba(255,255,255,0.18);
  }

  /* Componente */
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main {
    flex: 1;
    overflow-x: hidden;
    /* espacio para tab bar en mobile */
    padding-bottom: 0;
  }

  /* Tab bar solo en mobile */
  .tab-bar {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(10,10,15,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    padding: 0.6rem 1rem calc(0.6rem + env(safe-area-inset-bottom));
    z-index: 90;
    justify-content: space-around;
  }

  .tab-item {
    background: none;
    border: none;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
  }

  .tab-item:hover {
    color: var(--text-primary);
    background: rgba(255,255,255,0.04);
  }

  .tab-item--active {
    color: var(--accent);
  }

  .tab-item__icon {
    font-size: 1.3rem;
    line-height: 1;
  }

  .tab-item__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  @media (max-width: 768px) {
    .tab-bar { display: flex; }
    .main { padding-bottom: 70px; }
  }
</style>
