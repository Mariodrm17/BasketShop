<script>
  import { auth } from '../stores/auth.svelte.js'
</script>

<div class="page">
  <div class="profile-card">
    <!-- Avatar grande -->
    <div class="profile-avatar">
      <div class="avatar-ring">
        <div class="avatar-inner">
          {auth.username?.[0]?.toUpperCase() ?? '?'}
        </div>
      </div>
      <div class="avatar-glow"></div>
    </div>

    <div class="profile-info">
      <h1 class="profile-name">{auth.username}</h1>
      <div class="profile-role">
        <span class="role-badge role-badge--{auth.user?.role ?? 'user'}">
          {auth.user?.role ?? 'user'}
        </span>
        <span class="profile-since">Sesión activa</span>
      </div>
    </div>

    <div class="profile-meta">
      <div class="meta-item">
        <span class="meta-label">ID de usuario</span>
        <span class="meta-value meta-value--mono">{auth.user?.id?.slice(-12) ?? '—'}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Rol</span>
        <span class="meta-value">{auth.user?.role}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Permisos</span>
        <span class="meta-value">
          {auth.isAdmin ? 'Lectura + Escritura + Admin' : 'Solo lectura'}
        </span>
      </div>
    </div>

    {#if auth.isAdmin}
      <div class="profile-perms">
        <div class="perm perm--granted">
          <span class="perm__icon">✓</span>
          Ver productos
        </div>
        <div class="perm perm--granted">
          <span class="perm__icon">✓</span>
          Crear productos
        </div>
        <div class="perm perm--granted">
          <span class="perm__icon">✓</span>
          Editar productos
        </div>
        <div class="perm perm--granted">
          <span class="perm__icon">✓</span>
          Eliminar productos
        </div>
        <div class="perm perm--granted">
          <span class="perm__icon">✓</span>
          Gestionar usuarios
        </div>
      </div>
    {:else}
      <div class="profile-perms">
        <div class="perm perm--granted">
          <span class="perm__icon">✓</span>
          Ver productos
        </div>
        <div class="perm perm--denied">
          <span class="perm__icon">✕</span>
          Crear / editar productos
        </div>
        <div class="perm perm--denied">
          <span class="perm__icon">✕</span>
          Gestionar usuarios
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    padding: 3rem 2rem;
    max-width: 600px;
    margin: 0 auto;
    animation: fadeIn 0.3s ease;
  }

  .profile-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    position: relative;
    overflow: hidden;
  }

  .profile-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 120px;
    background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.05));
    pointer-events: none;
  }

  .profile-avatar {
    position: relative;
    z-index: 1;
  }

  .avatar-ring {
    width: 100px; height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), rgba(99,102,241,0.6));
    padding: 3px;
    position: relative;
  }

  .avatar-inner {
    width: 100%; height: 100%;
    border-radius: 50%;
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    color: var(--text-primary);
  }

  .avatar-glow {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%);
    pointer-events: none;
  }

  .profile-info {
    text-align: center;
    z-index: 1;
  }

  .profile-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    margin: 0 0 0.6rem;
  }

  .profile-role {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: center;
  }

  .role-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.3rem 0.75rem;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .role-badge--admin {
    background: rgba(139,92,246,0.15);
    color: #c4b5fd;
    border: 1px solid rgba(139,92,246,0.3);
  }

  .role-badge--user {
    background: rgba(99,102,241,0.1);
    color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.2);
  }

  .profile-since {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .profile-meta {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .meta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .meta-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .meta-value {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-primary);
    font-weight: 600;
  }

  .meta-value--mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--accent);
  }

  .profile-perms {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .perm {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .perm--granted {
    background: rgba(16,185,129,0.08);
    color: #6ee7b7;
    border: 1px solid rgba(16,185,129,0.15);
  }

  .perm--denied {
    background: rgba(156,163,175,0.06);
    color: var(--text-muted);
    border: 1px solid rgba(156,163,175,0.1);
  }

  .perm__icon {
    font-size: 0.75rem;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
    background: currentColor;
    color: #0f0f0f;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
