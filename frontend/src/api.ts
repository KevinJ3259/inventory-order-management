const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export function getToken() {
  return localStorage.getItem('inventory_token') || ''
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken()

  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (
    options.body &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })
}