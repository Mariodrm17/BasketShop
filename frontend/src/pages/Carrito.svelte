<script>
  import { auth } from '../stores/auth.svelte.js'
  import { toast } from '../stores/toast.svelte.js'
  import { getCart, removeFromCart } from '../services/api.js'

  let cart = $state([])
  let loading = $state(true)
  let processing = $state(false)

  const API_BASE = ''
  
  const total = $derived(
    cart.reduce((acc, item) => acc + (item.productId?.precio * item.quantity), 0)
  )

  $effect(() => {
    if (auth.isAuthenticated) loadCart()
  })

  async function loadCart() {
    loading = true
    try {
      cart = await getCart(auth.token)
    } catch (e) {
      toast.error('Error al cargar tu carrito')
    } finally {
      loading = false
    }
  }

  async function remove(id) {
    processing = true
    try {
      cart = await removeFromCart(id, auth.token)
      toast.success('Producto eliminado del carrito')
    } catch (e) {
      toast.error('No se pudo eliminar el producto')
    } finally {
      processing = false
    }
  }

  function checkout() {
    processing = true
    setTimeout(() => {
      toast.success('¡Compra realizada con éxito! 🎉')
      cart = []
      processing = false
    }, 1500)
  }

  function getImgSrc(img) {
    if (!img) return null
    return img.startsWith('http') ? img : `${API_BASE}/uploads/${img}`
  }
</script>

<div class="page">
  <div class="page__header">
    <h1 class="page__title">Carrito de Compra</h1>
    <p class="page__sub">Revisa tus productos y finaliza el pedido</p>
  </div>

  {#if loading}
    <div class="loading-skeleton">
      {#each Array(3) as _}
        <div class="skeleton-item"></div>
      {/each}
    </div>
  {:else if cart.length === 0}
    <div class="empty-state">
      <div class="empty-icon">🛒</div>
      <h2>Tu carrito está vacío</h2>
      <p>Explora nuestros productos y añade lo que más te guste.</p>
    </div>
  {:else}
    <div class="cart-grid">
      <div class="cart-items">
        {#each cart as item (item.productId?._id || item._id)}
          {#if item.productId}
            <div class="cart-item">
              <div class="item-img">
                {#if getImgSrc(item.productId.imagen)}
                  <img src={getImgSrc(item.productId.imagen)} alt="miniatura" />
                {:else}
                  <div class="placeholder-img">⬡</div>
                {/if}
              </div>
              <div class="item-info">
                <h3>{item.productId.nombre}</h3>
                <div class="item-price">{Number(item.productId.precio).toFixed(2)} EUR</div>
                <div class="item-qty">Cantidad: {item.quantity}</div>
              </div>
              <button class="btn-remove" onclick={() => remove(item.productId._id)} disabled={processing}>
                Eliminar
              </button>
            </div>
          {/if}
        {/each}
      </div>

      <div class="cart-summary">
        <h3>Resumen del Pedido</h3>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>{total.toFixed(2)} EUR</span>
        </div>
        <div class="summary-row">
          <span>Envío</span>
          <span>Gratis</span>
        </div>
        <hr />
        <div class="summary-row summary-row--total">
          <span>Total</span>
          <span>{total.toFixed(2)} EUR</span>
        </div>

        <button class="btn-checkout" onclick={checkout} disabled={processing || cart.length === 0}>
          {#if processing}
            <span class="spinner"></span> Procesando...
          {:else}
            Finalizar Compra →
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .page { padding: 2rem; max-width: 1000px; margin: 0 auto; animation: fadeIn 0.3s ease; }
  
  .page__header { margin-bottom: 2rem; }
  .page__title { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; margin: 0; color: var(--text-primary); letter-spacing: 0.04em; }
  .page__sub { color: var(--text-muted); margin: 0.5rem 0 0; font-size: 0.95rem; }

  .cart-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
  @media (min-width: 768px) { .cart-grid { grid-template-columns: 2fr 1fr; } }

  .cart-items { display: flex; flex-direction: column; gap: 1rem; }
  
  .cart-item {
    display: flex; gap: 1.5rem; background: var(--surface); padding: 1.25rem;
    border: 1px solid var(--border); border-radius: 12px; align-items: center;
  }
  
  .item-img {
    width: 80px; height: 80px; border-radius: 8px; overflow: hidden; background: var(--surface-2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .item-img img { width: 100%; height: 100%; object-fit: cover; }
  .placeholder-img { font-size: 2rem; opacity: 0.2; }

  .item-info { flex: 1; display: flex; flex-direction: column; gap: 0.3rem; }
  .item-info h3 { margin: 0; font-size: 1.1rem; color: var(--text-primary); }
  .item-price { font-family: 'Bebas Neue', auto; font-size: 1.2rem; color: var(--accent); letter-spacing: 0.02em; }
  .item-qty { font-size: 0.8rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 0.2rem 0.6rem; border-radius: 100px; width: fit-content; }

  .btn-remove {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5;
    padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: 0.2s; font-weight: 600;
  }
  .btn-remove:hover:not(:disabled) { background: rgba(239,68,68,0.2); }

  .cart-summary {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; height: fit-content; position: sticky; top: 100px;
  }
  .cart-summary h3 { margin: 0 0 1.5rem; font-family: 'DM Sans', auto; font-size: 1.2rem; }
  
  .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-muted); font-size: 0.95rem; }
  .summary-row--total { color: var(--text-primary); font-size: 1.3rem; font-weight: 700; margin-top: 1rem; margin-bottom: 2rem; }
  hr { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }

  .btn-checkout {
    width: 100%; padding: 1rem; background: var(--accent); border: none; color: white; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .btn-checkout:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139,92,246,0.3); }
  .btn-checkout:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .empty-state { text-align: center; padding: 4rem 2rem; }
  .empty-icon { font-size: 4rem; opacity: 0.2; margin-bottom: 1rem; }
  
  .loading-skeleton { display: flex; flex-direction: column; gap: 1rem; }
  .skeleton-item { height: 120px; background: var(--surface); border-radius: 12px; animation: shimmer 1.5s infinite; }

  .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
</style>
