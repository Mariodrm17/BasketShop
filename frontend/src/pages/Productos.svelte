<script>
  import { getProductos, deleteProducto } from '../services/api.js'
  import { auth } from '../stores/auth.svelte.js'
  import { toast } from '../stores/toast.svelte.js'
  import ProductCard from '../components/ProductCard.svelte'
  import ProductModal from '../components/ProductModal.svelte'
  import ConfirmDialog from '../components/ConfirmDialog.svelte'

  // Estado
  let productos = $state([])
  let loading = $state(false)
  let search = $state('')
  let showModal = $state(false)
  let editingProduct = $state(null)
  let deletingProduct = $state(null)
  let deleting = $state(false)

  // Productos filtrados con $derived
  const filtered = $derived(
    productos.filter(p =>
      p.nombre?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const stats = $derived({
    total: productos.length,
    activos: productos.filter(p => p.precio > 0).length,
    inactivos: productos.filter(p => !p.precio || p.precio <= 0).length
  })

  // Cargar al montar con $effect
  $effect(() => {
    if (auth.isAuthenticated) {
      loadProductos()
    }
  })

  async function loadProductos() {
    loading = true
    try {
      productos = await getProductos(auth.token)
    } catch (err) {
      toast.error('Error al cargar productos: ' + err.message)
    } finally {
      loading = false
    }
  }

  function openCreate() {
    editingProduct = null
    showModal = true
  }

  function openEdit(producto) {
    editingProduct = producto
    showModal = true
  }

  function openDelete(producto) {
    deletingProduct = producto
  }

  async function confirmDelete() {
    if (!deletingProduct) return
    deleting = true
    try {
      await deleteProducto(deletingProduct._id, auth.token)
      toast.success(`"${deletingProduct.nombre}" eliminado`)
      deletingProduct = null
      await loadProductos()
    } catch (err) {
      toast.error(err.message)
    } finally {
      deleting = false
    }
  }

  function onSaved() {
    loadProductos()
  }
</script>

<div class="page">
  <!-- Header -->
  <div class="page__header">
    <div class="page__title-group">
      <h1 class="page__title">Productos</h1>
      <div class="page__stats">
        <span class="stat-chip">{stats.total} total</span>
        <span class="stat-chip stat-chip--success">{stats.activos} activos</span>
        {#if stats.inactivos > 0}
          <span class="stat-chip stat-chip--muted">{stats.inactivos} inactivos</span>
        {/if}
      </div>
    </div>

    <div class="page__controls">
      <div class="search-box">
        <span class="search-box__icon">⌕</span>
        <input
          class="search-box__input"
          type="search"
          placeholder="Buscar productos..."
          bind:value={search}
        />
      </div>

      {#if auth.isAdmin}
        <button class="btn-primary" onclick={openCreate}>
          + Nuevo producto
        </button>
      {/if}
    </div>
  </div>

  <!-- Contenido -->
  {#if loading}
    <div class="loading-state">
      <div class="loading-grid">
        {#each Array(6) as _}
          <div class="skeleton-card">
            <div class="skeleton skeleton--media"></div>
            <div class="skeleton-body">
              <div class="skeleton skeleton--line" style="width:70%"></div>
              <div class="skeleton skeleton--line" style="width:40%"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if filtered.length === 0}
    <div class="empty-state">
      <div class="empty-state__icon">⬡</div>
      <h3 class="empty-state__title">
        {search ? 'Sin resultados' : 'Sin productos'}
      </h3>
      <p class="empty-state__sub">
        {search
          ? `No hay productos que coincidan con "${search}"`
          : auth.isAdmin
            ? 'Crea el primer producto pulsando el botón de arriba'
            : 'No hay productos disponibles aún'}
      </p>
      {#if search}
        <button class="btn-ghost" onclick={() => search = ''}>Limpiar búsqueda</button>
      {/if}
    </div>
  {:else}
    <div class="products-grid">
      {#each filtered as producto (producto._id)}
        <ProductCard
          {producto}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Modales -->
{#if showModal}
  <ProductModal
    producto={editingProduct}
    onClose={() => showModal = false}
    onSaved={onSaved}
  />
{/if}

{#if deletingProduct}
  <ConfirmDialog
    title="Eliminar producto"
    message={`¿Eliminar "${deletingProduct.nombre}"? Esta acción no se puede deshacer.`}
    loading={deleting}
    onConfirm={confirmDelete}
    onCancel={() => deletingProduct = null}
  />
{/if}

<style>
  .page {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    animation: fadeIn 0.3s ease;
  }

  .page__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .page__title-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .page__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    letter-spacing: 0.04em;
    color: var(--text-primary);
    margin: 0;
    line-height: 1;
  }

  .page__stats {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .stat-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.25rem 0.65rem;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    border-radius: 100px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-chip--success {
    background: rgba(16,185,129,0.1);
    border-color: rgba(16,185,129,0.25);
    color: #6ee7b7;
  }

  .stat-chip--muted {
    background: rgba(156,163,175,0.06);
    border-color: rgba(156,163,175,0.15);
    color: #9ca3af;
  }

  .page__controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .search-box:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
  }

  .search-box__icon {
    color: var(--text-muted);
    font-size: 1.1rem;
  }

  .search-box__input {
    background: none;
    border: none;
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    padding: 0.7rem 0;
    width: 220px;
    outline: none;
  }

  .search-box__input::placeholder { color: var(--text-faint); }

  .btn-primary {
    padding: 0.7rem 1.25rem;
    background: var(--accent);
    border: none;
    color: white;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
    box-shadow: 0 8px 25px rgba(139,92,246,0.4);
    transform: translateY(-1px);
  }

  .btn-ghost {
    padding: 0.6rem 1.25rem;
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-ghost:hover { color: var(--text-primary); border-color: var(--border-hover); }

  /* Grid */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
  }

  /* Loading skeletons */
  .loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
  }

  .skeleton-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .skeleton--media {
    height: 180px;
    width: 100%;
  }

  .skeleton-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .skeleton--line {
    height: 14px;
    border-radius: 4px;
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.09) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    text-align: center;
    gap: 1rem;
  }

  .empty-state__icon {
    font-size: 4rem;
    opacity: 0.1;
    filter: drop-shadow(0 0 20px var(--accent));
    line-height: 1;
  }

  .empty-state__title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .empty-state__sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
    max-width: 320px;
    line-height: 1.6;
  }

  @keyframes shimmer {
    to { background-position: -200% 0; }
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
