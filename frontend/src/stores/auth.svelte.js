// stores/auth.svelte.js — Estado global de autenticación con runes Svelte 5

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function createAuthStore() {
  // Persistencia: intentar restaurar desde localStorage
  const savedToken = localStorage.getItem('jwt_token')
  const savedUser = localStorage.getItem('jwt_user')

  let token = $state(savedToken || null)
  let user = $state(savedUser ? JSON.parse(savedUser) : null)

  const isAuthenticated = $derived(!!token)
  const isAdmin = $derived(user?.role === 'admin')
  const username = $derived(user?.username || '')

  function setSession(newToken) {
    token = newToken
    const payload = parseJwt(newToken)
    user = payload
    // Persistencia en localStorage
    localStorage.setItem('jwt_token', newToken)
    localStorage.setItem('jwt_user', JSON.stringify(payload))
  }

  function clearSession() {
    token = null
    user = null
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('jwt_user')
  }

  return {
    get token() { return token },
    get user() { return user },
    get isAuthenticated() { return isAuthenticated },
    get isAdmin() { return isAdmin },
    get username() { return username },
    setSession,
    clearSession
  }
}

export const auth = createAuthStore()
