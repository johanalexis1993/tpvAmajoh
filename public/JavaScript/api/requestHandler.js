const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const showError = (message, error) => {
  console.error(message, error)
  alert(`${message}\n${error ? error.message : ''}`)
}
const getToken = () => localStorage.getItem('token')
const handleResponse = async (response) => {
  const responseData = await response.json()
  if (!response.ok)
    throw new Error(responseData.message || 'Error al realizar la operación.')
  return responseData
}
const buildHeaders = (requireAuth, body, cacheControl) => {
  const headers = {
    'Cache-Control': cacheControl,
    Accept: 'application/json'
  }
  if (requireAuth) {
    const token = getToken()
    if (!token) throw new Error('No se encontró un token de autenticación.')
    headers['Authorization'] = `Bearer ${token}`
  }
  if (!(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  return headers
}
const request = async (
  url,
  options = {},
  requireAuth = true,
  cacheControl = 'max-age=120'
) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...buildHeaders(requireAuth, options.body, cacheControl),
        ...options.headers
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
  requireAuth = true
}) => {
  const body = ['POST', 'PUT'].includes(method) ? data : undefined
  const urlWithId = ['DELETE', 'PUT'].includes(method) ? `${url}/${id}` : url
  try {
    const response = await request(urlWithId, { method, body }, requireAuth)
    if (form && method === 'POST') form.reset()
    return response
  } catch (error) {
    showError(`Error en la petición ${method}`, error)
  }
}
export const getRequest = (url, requireAuth = true) =>
  handleRequest({ method: 'GET', url, requireAuth })
export const deleteRequest = (url, id) =>
  handleRequest({ method: 'DELETE', url, id })
export const putRequest = (url, id, formData) =>
  handleRequest({ method: 'PUT', url, id, data: formData })
export const postRequest = (url, formData, form, requireAuth = true) =>
  handleRequest({ method: 'POST', url, data: formData, form, requireAuth })
