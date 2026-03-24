<script>
  import { auth } from '../stores/auth.svelte.js'

  let { producto, onEdit, onDelete } = $props()

  const API_BASE = ''
  const imgSrc = $derived(
    producto.imagen
      ? `${API_BASE}/uploads/${producto.imagen}`
      : null
  )

  // Estado activo: se considera activo si existe y precio > 0
  const isActive = $derived(producto.precio > 0)
</script>

<article class="card">
  <div class="card__media">
    {#if imgSrc}
      <img src={imgSrc} alt={producto.nombre} class="card__img" />
    {:else}
      <div class="card__placeholder">
        <span class="card__placeholder-icon">⬡</span>
      </div>
    {/if}
    <div class="card__status {isActive ? 'status--active' : 'status--inactive'}">
      {isActive ? 'Activo' : 'Inactivo'}
    </div>
  </div>

  <div class="card__body">
    <h3 class="card__name">{producto.nombre}</h3>
    <div class="card__price">
      <span class="price__value">{Number(producto.precio).toFixed(2)}</span>
      <span class="price__currency">EUR</span>
    </div>

    {#if auth.isAdmin}
      <div class="card__actions">
        <button class="btn-action btn-action--edit" onclick={() => onEdit(producto)}>
          Editar
        </button>
        <button class="btn-action btn-action--delete" onclick={() => onDelete(producto)}>
          Eliminar
        </button>
      </div>
    {/if}
  </div>
</article>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                border-color 0.2s, box-shadow 0.25s;
  }

  .card:hover {
    transform: translateY(-4px);
    border-color: var(--border-hover);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.12);
  }

  .card__media {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: var(--surface-2);
  }

  .card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .card:hover .card__img {
    transform: scale(1.04);
  }

  .card__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.05));
  }

  .card__placeholder-icon {
    font-size: 3rem;
    opacity: 0.2;
  }

  .card__status {
    position: absolute;
    top: 10px;
    right: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    font-weight: 500;
    padding: 0.25rem 0.6rem;
    border-radius: 100px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .status--active {
    background: rgba(16,185,129,0.15);
    color: #6ee7b7;
    border: 1px solid rgba(16,185,129,0.3);
  }

  .status--inactive {
    background: rgba(156,163,175,0.1);
    color: #9ca3af;
    border: 1px solid rgba(156,163,175,0.2);
  }

  .card__body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .card__name {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
    margin: 0;
    /* Truncate */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .card__price {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
  }

  .price__value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.75rem;
    letter-spacing: 0.02em;
    color: var(--accent);
    line-height: 1;
  }

  .price__currency {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .card__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    padding-top: 0.25rem;
    border-top: 1px solid var(--border);
    margin-top: 0.25rem;
  }

  .btn-action {
    padding: 0.55rem;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }

  .btn-action--edit {
    background: rgba(99,102,241,0.12);
    color: #a5b4fc;
    border-color: rgba(99,102,241,0.25);
  }

  .btn-action--edit:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.45);
  }

  .btn-action--delete {
    background: rgba(239,68,68,0.08);
    color: #fca5a5;
    border-color: rgba(239,68,68,0.2);
  }

  .btn-action--delete:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.4);
  }
</style>
