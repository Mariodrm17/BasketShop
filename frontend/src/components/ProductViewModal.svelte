<script>
  import { toast } from '../stores/toast.svelte.js'
  import { auth } from '../stores/auth.svelte.js'
  import { addToCart } from '../services/api.js'

  let { producto = null, onClose } = $props()

  const API_BASE = ''
  const imgSrc = $derived(
    producto?.imagen
      ? (producto.imagen.startsWith('http') ? producto.imagen : `${API_BASE}/uploads/${producto.imagen}`)
      : null
  )

  let loading = $state(false)

  async function handleAddToCart() {
    loading = true
    try {
      await addToCart(producto._id, auth.token)
      toast.success('Producto añadido al carrito 🛒')
      onClose?.()
    } catch (err) {
      toast.error(err.message)
    } finally {
      loading = false
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose?.()
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" onclick={handleBackdrop}>
  <div class="modal" role="dialog" aria-modal="true">
    <button class="modal__close" onclick={onClose}>×</button>
    
    <div class="modal__content">
      <div class="modal__media">
        {#if imgSrc}
          <img src={imgSrc} alt={producto.nombre} class="modal__img" />
        {:else}
          <div class="modal__placeholder">⬡</div>
        {/if}
      </div>
      
      <div class="modal__info">
        <h2 class="modal__title">{producto.nombre}</h2>
        <div class="modal__price">{Number(producto.precio).toFixed(2)} <span class="currency">EUR</span></div>
        <div class="modal__status {producto.precio > 0 ? 'status--active' : 'status--inactive'}">
          {producto.precio > 0 ? 'Activo' : 'Inactivo'}
        </div>
        
        <p class="modal__desc">Añade este producto a tu carrito para comenzar el proceso de compra.</p>

        <div class="modal__actions">
          <button class="btn-buy" onclick={handleAddToCart} disabled={loading || producto.precio <= 0}>
            {#if loading}
              <span class="spinner"></span>
            {:else}
              Añadir al carrito 🛒
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.15s ease;
  }

  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; width: 100%; max-width: 600px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
    position: relative;
    overflow: hidden;
  }

  .modal__close {
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(0,0,0,0.5); border: none; color: white;
    font-size: 1.5rem; cursor: pointer; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; transition: all 0.2s; z-index: 10;
    backdrop-filter: blur(4px);
  }
  .modal__close:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }

  .modal__content {
    display: flex; flex-direction: column;
  }

  @media (min-width: 600px) {
    .modal__content { flex-direction: row; }
    .modal__media { width: 50%; }
    .modal__info { width: 50%; }
  }

  .modal__media {
    background: var(--surface-2);
    position: relative; aspect-ratio: 4/3;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  @media (min-width: 600px) {
    .modal__media { aspect-ratio: 1/1; border-right: 1px solid var(--border); }
  }

  .modal__img { width: 100%; height: 100%; object-fit: cover; }
  .modal__placeholder { font-size: 4rem; opacity: 0.2; }

  .modal__info {
    padding: 2rem; display: flex; flex-direction: column;
  }

  .modal__title {
    font-family: 'DM Sans', sans-serif; font-size: 1.5rem;
    font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .modal__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem;
    color: var(--accent); margin-bottom: 0.5rem; letter-spacing: 0.03em;
  }
  .currency { font-size: 1rem; font-family: 'JetBrains Mono', monospace; color: var(--text-muted); }

  .modal__status {
    font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
    padding: 0.3rem 0.8rem; border-radius: 100px; display: inline-block;
    align-self: flex-start; text-transform: uppercase; letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }
  .status--active { background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
  .status--inactive { background: rgba(156,163,175,0.1); color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }

  .modal__desc { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 2rem; line-height: 1.5; }

  .modal__actions { margin-top: auto; }

  .btn-buy {
    width: 100%; padding: 1rem; background: var(--accent); border: none;
    color: white; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 1rem;
    font-weight: 700; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .btn-buy:hover:not(:disabled) {
    background: var(--accent-hover); transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255,87,34,0.4);
  }
  .btn-buy:disabled { background: var(--surface-2); border: 1px solid var(--border); color: var(--text-faint); cursor: not-allowed; }

  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;
  }

  @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(8px); } }
  @keyframes slideUp { from { transform: translateY(40px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
