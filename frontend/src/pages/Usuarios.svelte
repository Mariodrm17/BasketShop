<script>
  import { getUsers, deleteUser } from '../services/api.js'
  import { auth } from '../stores/auth.svelte.js'
  import { toast } from '../stores/toast.svelte.js'
  import UserRow from '../components/UserRow.svelte'
  import UserModal from '../components/UserModal.svelte'
  import ConfirmDialog from '../components/ConfirmDialog.svelte'

  let users = $state([])
  let loading = $state(false)
  let search = $state('')
  let roleFilter = $state('all')
  let showModal = $state(false)
  let editingUser = $state(null)
  let deletingUser = $state(null)
  let deleting = $state(false)

  const filtered = $derived(
    users.filter(u => {
      const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchSearch && matchRole
    })
  )

  const stats = $derived({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regular: users.filter(u => u.role === 'user').length
  })

  $effect(() => {
    if (auth.isAdmin) loadUsers()
  })

  async function loadUsers() {
    loading = true
    try {
      users = await getUsers(auth.token)
    } catch (err) {
      toast.error('Error al cargar usuarios: ' + err.message)
    } finally {
      loading = false
    }
  }

  function openCreate() {
    editingUser = null
    showModal = true
  }

  function openEdit(user) {
    editingUser = user
    showModal = true
  }

  function openDelete(user) {
    deletingUser = user
  }

  async function confirmDelete() {
    if (!deletingUser) return
    deleting = true
    try {
      await deleteUser(deletingUser._id, auth.token)
      toast.success(`Usuario "${deletingUser.username}" eliminado`)
      deletingUser = null
      await loadUsers()
    } catch (err) {
      toast.error(err.message)
    } finally {
      deleting = false
    }
  }
</script>

<div class="page">
  <!-- Header -->
  <div class="page__header">
    <div class="page__title-group">
      <h1 class="page__title">Usuarios</h1>
      <div class="page__stats">
        <span class="stat-chip">{stats.total} total</span>
        <span class="stat-chip stat-chip--admin">{stats.admins} admins</span>
        <span class="stat-chip stat-chip--user">{stats.regular} usuarios</span>
      </div>
    </div>

    <div class="page__controls">
      <div class="search-box">
        <span class="search-box__icon">⌕</span>
        <input
          class="search-box__input"
          type="search"
          placeholder="Buscar usuarios..."
          bind:value={search}
        />
      </div>

      <div class="filter-tabs">
        <button
          class="filter-tab {roleFilter === 'all' ? 'filter-tab--active' : ''}"
          onclick={() => roleFilter = 'all'}
        >Todos</button>
        <button
          class="filter-tab {roleFilter === 'admin' ? 'filter-tab--active' : ''}"
          onclick={() => roleFilter = 'admin'}
        >Admin</button>
        <button
          class="filter-tab {roleFilter === 'user' ? 'filter-tab--active' : ''}"
          onclick={() => roleFilter = 'user'}
        >User</button>
      </div>

      <button class="btn-primary" onclick={openCreate}>
        + Nuevo usuario
      </button>
    </div>
  </div>

  <!-- Tabla / lista -->
  {#if loading}
    <div class="users-list">
      {#each Array(5) as _}
        <div class="skeleton-row">
          <div class="skeleton skeleton--avatar"></div>
          <div class="skeleton-info">
            <div class="skeleton skeleton--line" style="width:160px"></div>
            <div class="skeleton skeleton--line" style="width:100px; height:10px; margin-top:4px"></div>
          </div>
          <div class="skeleton skeleton--badge" style="margin-left:auto; width:60px"></div>
        </div>
      {/each}
    </div>
  {:else if filtered.length === 0}
    <div class="empty-state">
      <div class="empty-state__icon">👤</div>
      <h3 class="empty-state__title">
        {search || roleFilter !== 'all' ? 'Sin resultados' : 'Sin usuarios'}
      </h3>
      <p class="empty-state__sub">
        {search
          ? `No hay usuarios que coincidan con "${search}"`
          : 'Crea el primer usuario con el botón de arriba'}
      </p>
      {#if search || roleFilter !== 'all'}
        <button class="btn-ghost" onclick={() => { search = ''; roleFilter = 'all' }}>
          Limpiar filtros
        </button>
      {/if}
    </div>
  {:else}
    <div class="users-list">
      {#each filtered as user (user._id)}
        <UserRow {user} onEdit={openEdit} onDelete={openDelete} />
      {/each}
    </div>
  {/if}
</div>

{#if showModal}
  <UserModal
    user={editingUser}
    onClose={() => showModal = false}
    onSaved={() => loadUsers()}
  />
{/if}

{#if deletingUser}
  <ConfirmDialog
    title="Eliminar usuario"
    message={`¿Eliminar a "${deletingUser.username}"? Perderá acceso al sistema.`}
    loading={deleting}
    onConfirm={confirmDelete}
    onCancel={() => deletingUser = null}
  />
{/if}

<style>
  .page {
    padding: 2rem;
    max-width: 900px;
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

  .stat-chip--admin {
    background: rgba(139,92,246,0.12);
    border-color: rgba(139,92,246,0.25);
    color: #c4b5fd;
  }

  .stat-chip--user {
    background: rgba(99,102,241,0.1);
    border-color: rgba(99,102,241,0.2);
    color: #a5b4fc;
  }

  .page__controls {
    display: flex;
    gap: 0.75rem;
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
    background: none; border: none;
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    padding: 0.7rem 0;
    width: 200px;
    outline: none;
  }

  .search-box__input::placeholder { color: var(--text-faint); }

  .filter-tabs {
    display: flex;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
  }

  .filter-tab {
    padding: 0.35rem 0.8rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .filter-tab:hover { color: var(--text-primary); }

  .filter-tab--active {
    background: var(--accent);
    color: white;
  }

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

  .users-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  /* Skeleton */
  .skeleton-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .skeleton--avatar {
    width: 38px; height: 38px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .skeleton-info {
    flex: 1;
  }

  .skeleton--badge {
    height: 24px;
    border-radius: 100px;
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
    border-radius: 6px;
    height: 14px;
  }

  /* Empty */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    text-align: center;
    gap: 1rem;
  }

  .empty-state__icon {
    font-size: 3rem;
    opacity: 0.15;
    line-height: 1;
  }

  .empty-state__title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .empty-state__sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
    max-width: 300px;
    line-height: 1.6;
  }

  @keyframes shimmer { to { background-position: -200% 0; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
