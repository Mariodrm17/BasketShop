<script>
  import { toast } from '../stores/toast.svelte.js'
  import { auth } from '../stores/auth.svelte.js'
  import { createProducto, updateProducto } from '../services/api.js'

  let { producto = null, onClose, onSaved } = $props()

  const isEditing = $derived(!!producto?._id)

  // Estado del formulario con $state
  let nombre = $state(producto?.nombre ?? '')
  let precio = $state(producto?.precio ?? '')
  let imagenFile = $state(null)
  let loading = $state(false)
  let errors = $state({})

  function validate() {
    const e = {}
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!precio || isNaN(precio) || Number(precio) < 0) e.precio = 'Precio inválido'
    errors = e
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    loading = true
    try {
      if (isEditing) {
        await updateProducto(producto._id, { nombre: nombre.trim(), precio: Number(precio) }, auth.token)
        toast.success('Producto actualizado')
      } else {
        await createProducto({ nombre: nombre.trim(), precio: Number(precio), imagen: imagenFile }, auth.token)
        toast.success('Producto creado')
      }
      onSaved?.()
      onClose?.()
    } catch (err) {
      toast.error(err.message)
    } finally {
      loading = false
    }
  }

  function handleFile(e) {
    imagenFile = e.target.files[0] || null
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose?.()
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" onclick={handleBackdrop}>
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal__header">
      <h2 class="modal__title">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h2>
      <button class="modal__close" onclick={onClose}>×</button>
    </div>

    <form class="modal__form" onsubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div class="field">
        <label class="field__label" for="nombre">Nombre del producto</label>
        <input
          id="nombre"
          class="field__input {errors.nombre ? 'field__input--error' : ''}"
          type="text"
          placeholder="Ej: Camiseta premium"
          bind:value={nombre}
          disabled={loading}
        />
        {#if errors.nombre}
          <span class="field__error">{errors.nombre}</span>
        {/if}
      </div>

      <div class="field">
        <label class="field__label" for="precio">Precio (€)</label>
        <input
          id="precio"
          class="field__input {errors.precio ? 'field__input--error' : ''}"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          bind:value={precio}
          disabled={loading}
        />
        {#if errors.precio}
          <span class="field__error">{errors.precio}</span>
        {/if}
      </div>

      {#if !isEditing}
        <div class="field">
          <label class="field__label" for="imagen">Imagen (opcional)</label>
          <input
            id="imagen"
            class="field__input field__input--file"
            type="file"
            accept="image/*"
            onchange={handleFile}
            disabled={loading}
          />
          {#if imagenFile}
            <span class="field__hint">📎 {imagenFile.name}</span>
          {/if}
        </div>
      {/if}

      <div class="modal__actions">
        <button type="button" class="btn-cancel" onclick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" class="btn-save" disabled={loading}>
          {#if loading}
            <span class="spinner"></span>
          {:else}
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.15s ease;
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.5rem 0;
  }

  .modal__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.04em;
    color: var(--text-primary);
    margin: 0;
  }

  .modal__close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .modal__close:hover {
    background: rgba(255,255,255,0.08);
    color: var(--text-primary);
  }

  .modal__form {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .field__input {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    padding: 0.75rem 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .field__input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
  }

  .field__input--error {
    border-color: var(--error) !important;
  }

  .field__input--file {
    padding: 0.6rem 1rem;
    cursor: pointer;
  }

  .field__input--file::file-selector-button {
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.3);
    color: var(--accent);
    padding: 0.3rem 0.8rem;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    margin-right: 0.75rem;
    transition: all 0.2s;
  }

  .field__error {
    font-size: 0.78rem;
    color: var(--error);
    font-family: 'DM Sans', sans-serif;
  }

  .field__hint {
    font-size: 0.78rem;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
  }

  .modal__actions {
    display: flex;
    gap: 0.75rem;
    padding-top: 0.5rem;
  }

  .btn-cancel {
    flex: 1;
    padding: 0.75rem;
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel:hover {
    border-color: var(--border-hover);
    color: var(--text-primary);
  }

  .btn-save {
    flex: 2;
    padding: 0.75rem;
    background: var(--accent);
    border: none;
    color: white;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-save:hover:not(:disabled) {
    background: var(--accent-hover);
    box-shadow: 0 8px 25px rgba(139,92,246,0.4);
  }

  .btn-save:disabled, .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { transform: translateY(30px) scale(0.96); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
