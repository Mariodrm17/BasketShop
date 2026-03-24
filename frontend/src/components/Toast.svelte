<script>
  import { toast } from '../stores/toast.svelte.js'
</script>

<div class="toast-container">
  {#each toast.toasts as t (t.id)}
    <div class="toast toast--{t.type}" role="alert">
      <span class="toast__icon">
        {#if t.type === 'success'}✓{:else if t.type === 'error'}✕{:else}i{/if}
      </span>
      <span class="toast__msg">{t.message}</span>
      <button class="toast__close" onclick={() => toast.remove(t.id)}>×</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.25rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 280px;
    max-width: 400px;
    pointer-events: all;
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1px solid transparent;
    backdrop-filter: blur(12px);
  }

  .toast--success {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.4);
    color: #6ee7b7;
  }

  .toast--error {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.4);
    color: #fca5a5;
  }

  .toast--info {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
    color: #a5b4fc;
  }

  .toast__icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
    background: currentColor;
    color: #0f0f0f;
  }

  .toast__msg {
    flex: 1;
  }

  .toast__close {
    background: none;
    border: none;
    color: currentColor;
    cursor: pointer;
    opacity: 0.6;
    font-size: 1.2rem;
    line-height: 1;
    padding: 0;
    transition: opacity 0.2s;
  }

  .toast__close:hover { opacity: 1; }

  @keyframes slideUp {
    from { transform: translateY(20px) scale(0.95); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
</style>
