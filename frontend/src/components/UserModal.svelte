<script>
  import { auth } from '../stores/auth.svelte.js'
  import { toast } from '../stores/toast.svelte.js'
  import { createUser, updateUser } from '../services/api.js'

  let { user = null, onClose, onSaved } = $props()

  const isEditing = $derived(!!user?._id)

  let username = $state(user?.username ?? '')
  let password = $state('')
  let role = $state(user?.role ?? 'user')
  let loading = $state(false)
  let errors = $state({})

  function validate() {
    const e = {}
    if (!username.trim()) e.username = 'Nombre de usuario requerido'
    if (!isEditing && !password) e.password = 'Contraseña requerida'
    if (password && password.length < 4) e.password = 'Mínimo 4 caracteres'
    errors = e
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    loading = true
    try {
      const data = { username: username.trim(), role }
      if (password) data.password = password

      if (isEditing) {
        await updateUser(user._id, data, auth.token)
        toast.success('Usuario actualizado')
      } else {
        await createUser(data, auth.token)
        toast.success('Usuario creado')
      }
      onSaved?.()
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
  <div class="modal" role="dialog">
    <div class="modal__header">
      <h2 class="modal__title">{isEditing ? 'Editar usuario' : 'Nuevo usuario'}</h2>
      <button class="modal__close" onclick={onClose}>×</button>
    </div>

    <form class="modal__form" onsubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div class="field">
        <label class="field__label" for="u-username">Usuario</label>
        <input id="u-username" class="field__input {errors.username ? 'err' : ''}"
          type="text" placeholder="nombre_usuario"
          bind:value={username} disabled={loading} />
        {#if errors.username}<span class="field__error">{errors.username}</span>{/if}
      </div>

      <div class="field">
        <label class="field__label" for="u-password">
          {isEditing ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
        </label>
        <input id="u-password" class="field__input {errors.password ? 'err' : ''}"
          type="password" placeholder="••••••••"
          bind:value={password} disabled={loading} />
        {#if errors.password}<span class="field__error">{errors.password}</span>{/if}
      </div>

      <div class="field">
        <label class="field__label" for="u-role">Rol</label>
        <select id="u-role" class="field__input" bind:value={role} disabled={loading}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div class="modal__actions">
        <button type="button" class="btn-cancel" onclick={onClose} disabled={loading}>Cancelar</button>
        <button type="submit" class="btn-save" disabled={loading}>
          {#if loading}<span class="spinner"></span>
          {:else}{isEditing ? 'Guardar' : 'Crear usuario'}{/if}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.15s ease;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; width: 100%; max-width: 420px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .modal__header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 1.5rem 0;
  }
  .modal__title {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem;
    letter-spacing: 0.04em; color: var(--text-primary); margin: 0;
  }
  .modal__close {
    background: none; border: none; color: var(--text-muted);
    font-size: 1.5rem; cursor: pointer; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; transition: all 0.2s;
  }
  .modal__close:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); }
  .modal__form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
  .field { display: flex; flex-direction: column; gap: 0.5rem; }
  .field__label {
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .field__input {
    background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text-primary); font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; padding: 0.75rem 1rem;
    transition: border-color 0.2s, box-shadow 0.2s; outline: none;
  }
  .field__input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
  .field__input.err { border-color: var(--error) !important; }
  .field__error { font-size: 0.78rem; color: var(--error); font-family: 'DM Sans', sans-serif; }
  .modal__actions { display: flex; gap: 0.75rem; padding-top: 0.5rem; }
  .btn-cancel {
    flex: 1; padding: 0.75rem; background: none; border: 1px solid var(--border);
    color: var(--text-muted); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .btn-cancel:hover { color: var(--text-primary); border-color: var(--border-hover); }
  .btn-save {
    flex: 2; padding: 0.75rem; background: var(--accent); border: none;
    color: white; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .btn-save:hover:not(:disabled) { background: var(--accent-hover); box-shadow: 0 8px 25px rgba(139,92,246,0.4); }
  .btn-save:disabled, .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
    border-radius: 50%; animation: spin 0.6s linear infinite;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { transform: translateY(30px) scale(0.96); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
