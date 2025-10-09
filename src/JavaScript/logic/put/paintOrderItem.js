import { createOrderElements } from './createOrderElements.js'
import { appendOrderElementsToDom } from './appendOrderElementsToDom.js'
import { createAndConfigureButtons } from './createAndConfigureButtons.js'
export const paintOrderItem = (pedido) => {
  const table = pedido?.nameTable || 'DOMICILIO'
  const u = pedido?.user
  const cliente = Array.isArray(u) ? u[0]?.name ?? '—' : u?.name ?? '—'
  const createdAt = pedido?.createdAt ? new Date(pedido.createdAt) : null
  const horaCreacion = createdAt ? createdAt.toLocaleString() : '—'
  const tiempoTranscurrido = createdAt
    ? Math.floor((Date.now() - createdAt.getTime()) / 60000)
    : 0
  const productos = (pedido?.products || [])
    .map(
      (p) => p?.name ?? p?.title ?? p?.product?.name ?? p?.product?.title ?? '—'
    )
    .join(', ')
  const pedidoItem = document.createElement('li')
  const details = document.createElement('details')
  const summary = document.createElement('summary')
  summary.textContent = `Pedido: ${table}`
  details.append(summary)
  const elements = createOrderElements(
    pedido,
    table,
    cliente,
    horaCreacion,
    tiempoTranscurrido,
    productos
  )
  appendOrderElementsToDom(elements, details)
  createAndConfigureButtons(pedido, details)
  pedidoItem.append(details)
  return pedidoItem
}
