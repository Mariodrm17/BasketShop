<script>
  let { title = '¿Estás seguro?', message = '', onConfirm, onCancel, loading = false } = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="backdrop" onclick={(e) => e.target === e.currentTarget && onCancel?.()}>
  <div class="dialog" role="alertdialog" aria-modal="true">
    <div class="dialog__icon">⚠</div>
    <h3 class="dialog__title">{title}</h3>
    {#if message}
      <p class="dialog__msg">{message}</p>
    {/if}
    <div class="dialog__actions">
      <button class="btn-cancel" onclick={onCancel} disabled={loading}>Cancelar</button>
      <button class="btn-confirm" onclick={onConfirm} disabled={loading}>
        {#if loading}<span class="spinner"></span>{:else}Eliminar{/if}
      </button>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    z-index: 1100;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.15s ease;
  }

  .dialog {
    background: var(--surface);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 380px;
    text-align: center;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }

  .dialog__icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 12px rgba(239,68,68,0.5));
  }

  .dialog__title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
  }

  .dialog__msg {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0 0 1.5rem;
    line-height: 1.5;
  }

  .dialog__actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn-cancel {
    flex: 1; padding: 0.7rem;
    background: none; border: 1px solid var(--border);
    color: var(--text-muted); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.875rem;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-cancel:hover { color: var(--text-primary); border-color: var(--border-hover); }

  .btn-confirm {
    flex: 1; padding: 0.7rem;
    background: var(--error); border: none;
    color: white; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.875rem;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .btn-confirm:hover:not(:disabled) { filter: brightness(1.15); box-shadow: 0 6px 20px rgba(239,68,68,0.4); }
  .btn-confirm:disabled, .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { transform: translateY(20px) scale(0.96); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
