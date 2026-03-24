<script>
  let { user, onEdit, onDelete } = $props()
</script>

<div class="row">
  <div class="row__avatar">
    {user.username[0]?.toUpperCase()}
  </div>
  <div class="row__info">
    <span class="row__name">{user.username}</span>
    <span class="row__id">ID: {user._id?.slice(-8)}</span>
  </div>
  <div class="row__role">
    <span class="role-badge role-badge--{user.role}">
      {user.role}
    </span>
  </div>
  <div class="row__actions">
    <button class="btn-sm btn-sm--edit" onclick={() => onEdit(user)}>Editar</button>
    <button class="btn-sm btn-sm--delete" onclick={() => onDelete(user)}>Eliminar</button>
  </div>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .row:hover {
    border-color: var(--border-hover);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }

  .row__avatar {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), rgba(99,102,241,0.6));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    color: white;
    flex-shrink: 0;
  }

  .row__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .row__name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.925rem;
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row__id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    color: var(--text-muted);
  }

  .row__role {
    flex-shrink: 0;
  }

  .role-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.25rem 0.65rem;
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

  .row__actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .btn-sm {
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
  }

  .btn-sm--edit {
    background: rgba(99,102,241,0.1);
    color: #a5b4fc;
    border-color: rgba(99,102,241,0.2);
  }
  .btn-sm--edit:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); }

  .btn-sm--delete {
    background: rgba(239,68,68,0.08);
    color: #fca5a5;
    border-color: rgba(239,68,68,0.2);
  }
  .btn-sm--delete:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.4); }
</style>
