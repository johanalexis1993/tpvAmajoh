import { BASE_URL, showError } from '../api/requestHandler.js'
import { orders } from '../api/gets.js'
//const url = `${BASE_URL}/sse/orders`
const sse = new EventSource(`${BASE_URL}/sse/orders`)
/*console.log('[SSE] URL:', url)
console.log('[SSE] readyState=', sse.readyState)
setInterval(() => console.log('[SSE] tick readyState=', sse.readyState), 5000)*/
//sse.onopen = () => console.log('[SSE] Conectado con éxito')
sse.onmessage = async (e) => {
  const raw = e.data?.trim()
  if (!raw || (!raw.startsWith('{') && !raw.startsWith('['))) return
  try {
    const pendingOrders = JSON.parse(raw)
    if (Array.isArray(pendingOrders) && pendingOrders.length > 0) {
      //console.log('[SSE] Pedidos pendientes detectados, actualizando…')
      await orders('pedidos/')
    }
  } catch {
    // No usamos showError aquí para no molestar por mensajes no-JSON/heartbeats.
  }
}
sse.onerror = (err) => {
  showError('SSE desconectado o bloqueado (reintentando)', err)
  //console.warn('[SSE] error; el navegador reintenta automáticamente', err)
}
addEventListener('beforeunload', () => sse.close())
