import { showToast } from '../helpers/showToast.js'
export const BASE_URL = import.meta.env.VITE_API_BASE_URL
let lastAlertTs = 0
export const showError = (message, error) => {
  const now = Date.now()
  if (now - lastAlertTs < 300) {
    console.error('[debounced]', message, error)
    return
  }
  lastAlertTs = now
  if (error && error.__shown) {
    console.error('[silencioso]', message, error)
    return
  }
  if (error) error.__shown = true
  console.error(message, error)
  showToast(`${message}${error ? ': ' + error.message : ''}`, 'error')
}
const handleResponse = async (response) => {
  if (response.status === 204) return null
  const ct = response.headers.get('content-type') || ''
  const isJson = ct.includes('application/json')
  const data = isJson
    ? await response.json().catch(() => ({}))
    : await response.text()
  if (!response.ok) {
    const msg =
      (isJson && (data?.message || data?.error)) || `HTTP ${response.status}`
    throw new Error(msg || 'Error al realizar la operación.')
  }
  return data
}
const buildHeaders = (body) => {
  const headers = { Accept: 'application/json' }
  const isForm = body instanceof FormData
  if (body !== undefined && !isForm)
    headers['Content-Type'] = 'application/json'
  return headers
}
const normalizeCacheMode = (m) =>
  m === 'default' || m === 'no-store' || m === 'reload' ? m : 'default'
const request = async (url, options = {}, cacheMode = 'default') => {
  const base = (BASE_URL || '').replace(/\/+$/, '')
  const path = String(url || '').replace(/^\/+/, '')
  const finalUrl = `${base}/${path}`
  let body = options.body
  const isForm = body instanceof FormData
  if (body !== undefined && !isForm && typeof body !== 'string')
    body = JSON.stringify(body)
  try {
    const response = await fetch(finalUrl, {
      ...options,
      body,
      credentials: 'include',
      cache: normalizeCacheMode(cacheMode),
      headers: {
        ...buildHeaders(body),
        ...(options.headers || {})
      }
    })
    return await handleResponse(response)
  } catch (error) {
    showError('Error en la petición', error)
    throw error
  }
}
const handleRequest = async ({
  method,
  url,
  id,
  data,
  form,
  cacheMode = 'default'
}) => {
  const body = ['POST', 'PUT', 'PATCH'].includes(method) ? data : undefined
  const urlWithId =
    ['DELETE', 'PUT', 'PATCH'].includes(method) && id ? `${url}/${id}` : url
  const DEBUG_API =
    import.meta.env.DEV && import.meta.env.VITE_DEBUG_API === '1'
  if (DEBUG_API) {
    if (body instanceof FormData) {
      for (const [k, v] of body.entries()) console.log('FormData =>', k, v)
    } else if (body === undefined) {
      console.log('Sin body (GET/DELETE)')
    } else {
      console.log('Body JSON =>', body)
    }
  }
  try {
    const res = await request(urlWithId, { method, body }, cacheMode)
    if (form && method === 'POST') form.reset()
    return res
  } catch (error) {
    showError(`Error en la petición ${method}`, error)
    throw error
  }
}
export const getRequest = (url, cacheMode = 'default') =>
  handleRequest({ method: 'GET', url, cacheMode })
export const deleteRequest = (url, id) =>
  handleRequest({ method: 'DELETE', url, id })
export const putRequest = (url, id, data) =>
  handleRequest({ method: 'PUT', url, id, data })
export const postRequest = (url, data, form, cacheMode = 'default') =>
  handleRequest({ method: 'POST', url, data, form, cacheMode })
