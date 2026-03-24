// services/api.js — Servicio de comunicación con el backend

const BASE = '/api'

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(BASE + path, opts)
  const data = await res.json().catch(() => ({}))

  if (!res.ok) throw new Error(data.error || data.message || 'Error desconocido')
  return data
}

async function requestFormData(method, path, formData, token = null) {
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(BASE + path, { method, headers, body: formData })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || data.message || 'Error desconocido')
  return data
}

// Auth
export const login = (username, password) =>
  request('POST', '/login', { username, password })

export const register = (username, password) =>
  request('POST', '/register', { username, password })

// Productos
export const getProductos = (token) =>
  request('GET', '/productos', null, token)

export const createProducto = (data, token) => {
  const fd = new FormData()
  fd.append('nombre', data.nombre)
  fd.append('precio', data.precio)
  if (data.imagen) fd.append('imagen', data.imagen)
  return requestFormData('POST', '/productos', fd, token)
}

export const updateProducto = (id, data, token) =>
  request('PUT', `/productos/${id}`, data, token)

export const deleteProducto = (id, token) =>
  request('DELETE', `/productos/${id}`, null, token)

// Usuarios (admin)
export const getUsers = (token) =>
  request('GET', '/users', null, token)

export const createUser = (data, token) =>
  request('POST', '/users', data, token)

export const updateUser = (id, data, token) =>
  request('PUT', `/users/${id}`, data, token)

export const deleteUser = (id, token) =>
  request('DELETE', `/users/${id}`, null, token)
