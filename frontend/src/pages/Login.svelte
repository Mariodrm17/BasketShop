<script>
  import { login, register } from '../services/api.js'
  import { auth } from '../stores/auth.svelte.js'
  import { toast } from '../stores/toast.svelte.js'

  let { onLogin } = $props()

  let isLogin = $state(true)
  let username = $state('')
  let password = $state('')
  let loading = $state(false)
  let error = $state('')

  async function handleSubmit() {
    if (!username || !password) {
      error = 'Completa todos los campos'
      return
    }
    loading = true
    error = ''
    try {
      if (isLogin) {
        const data = await login(username, password)
        auth.setSession(data.token)
        toast.success(`Bienvenido, ${username}`)
        onLogin?.()
      } else {
        await register(username, password)
        const data = await login(username, password)
        auth.setSession(data.token)
        toast.success(`Registro exitoso. Bienvenido, ${username}`)
        onLogin?.()
      }
    } catch (err) {
      error = err.message
    } finally {
      loading = false
    }
  }
</script>

<div class="login-page">
  <!-- Fondo decorativo -->
  <div class="bg-orb bg-orb--1"></div>
  <div class="bg-orb bg-orb--2"></div>
  <div class="bg-grid"></div>

  <div class="login-card">
    <div class="login-card__brand">
      <span class="brand-hex">⬡</span>
      <span class="brand-name">PROD<span>OS</span></span>
    </div>

    <div class="login-card__header">
      <h1 class="login-card__title">{isLogin ? 'Accede a tu cuenta' : 'Crear cuenta'}</h1>
      <p class="login-card__sub">{isLogin ? 'Sistema de gestión de productos' : 'Únete a nuestro sistema de gestión'}</p>
    </div>

    <div class="login-tabs">
      <button class="login-tab {isLogin ? 'active' : ''}" onclick={() => { isLogin = true; error = ''; }}>Iniciar Sesión</button>
      <button class="login-tab {!isLogin ? 'active' : ''}" onclick={() => { isLogin = false; error = ''; }}>Registrarse</button>
    </div>

    <form class="login-form" onsubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div class="field">
        <label class="field__label" for="login-user">Usuario</label>
        <input
          id="login-user"
          class="field__input"
          type="text"
          placeholder="tu_usuario"
          autocomplete="username"
          bind:value={username}
          disabled={loading}
        />
      </div>

      <div class="field">
        <label class="field__label" for="login-pass">Contraseña</label>
        <input
          id="login-pass"
          class="field__input"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          bind:value={password}
          disabled={loading}
        />
      </div>

      {#if error}
        <div class="login-error">
          <span>⚠</span> {error}
        </div>
      {/if}

      <button type="submit" class="btn-login" disabled={loading}>
        {#if loading}
          <span class="spinner"></span> {isLogin ? 'Verificando...' : 'Registrando...'}
        {:else}
          {isLogin ? 'Iniciar sesión →' : 'Crear cuenta →'}
        {/if}
      </button>
    </form>

    <div class="login-card__hint">
      <p>Credenciales de prueba:</p>
      <div class="hint-grid">
        <div class="hint-cred">
          <span class="hint-role">admin</span>
          <span class="hint-pass">admin123</span>
        </div>
        <div class="hint-cred">
          <span class="hint-role">user</span>
          <span class="hint-pass">user123</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  /* Orbs decorativos */
  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }

  .bg-orb--1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(139,92,246,0.15), transparent);
    top: -150px; left: -100px;
  }

  .bg-orb--2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(99,102,241,0.1), transparent);
    bottom: -100px; right: -80px;
  }

  .bg-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .login-card {
    position: relative;
    z-index: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.4),
                0 0 0 1px rgba(255,255,255,0.04);
    animation: cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }

  .login-card__brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 2rem;
  }

  .brand-hex {
    font-size: 1.8rem;
    color: var(--accent);
  }

  .brand-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.06em;
    color: var(--text-primary);
  }

  .brand-name span { color: var(--accent); }

  .login-card__header {
    margin-bottom: 1.5rem;
  }

  .login-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.25rem;
  }

  .login-tab {
    flex: 1;
    padding: 0.6rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .login-tab:hover {
    color: var(--text-primary);
  }

  .login-tab.active {
    background: var(--surface);
    color: var(--text-primary);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .login-card__title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.4rem;
  }

  .login-card__sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field__label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .field__input {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    padding: 0.85rem 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .field__input::placeholder { color: var(--text-faint); }

  .field__input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
  }

  .field__input:disabled { opacity: 0.6; cursor: not-allowed; }

  .login-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px;
    color: #fca5a5;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    animation: shake 0.3s ease;
  }

  .btn-login {
    width: 100%;
    padding: 0.9rem;
    background: var(--accent);
    border: none;
    color: white;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    letter-spacing: 0.01em;
  }

  .btn-login:hover:not(:disabled) {
    background: var(--accent-hover);
    box-shadow: 0 10px 30px rgba(139,92,246,0.5);
    transform: translateY(-1px);
  }

  .btn-login:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .login-card__hint {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .login-card__hint p {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  .hint-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .hint-cred {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.6rem 0.75rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .hint-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--accent);
  }

  .hint-pass {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  @keyframes cardIn {
    from { transform: translateY(30px) scale(0.96); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>
