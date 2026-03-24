// stores/toast.svelte.js — Sistema de notificaciones global

function createToastStore() {
  let toasts = $state([])
  let nextId = 0

  function add(message, type = 'info', duration = 3500) {
    const id = nextId++
    toasts = [...toasts, { id, message, type }]
    setTimeout(() => remove(id), duration)
  }

  function remove(id) {
    toasts = toasts.filter(t => t.id !== id)
  }

  function success(msg) { add(msg, 'success') }
  function error(msg) { add(msg, 'error', 4500) }
  function info(msg) { add(msg, 'info') }

  return {
    get toasts() { return toasts },
    success,
    error,
    info,
    remove
  }
}

export const toast = createToastStore()
