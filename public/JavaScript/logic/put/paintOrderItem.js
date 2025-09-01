import { createOrderElements } from './createOrderElements.js'
import { appendOrderElementsToDom } from './appendOrderElementsToDom.js'
import { createAndConfigureButtons } from './createAndConfigureButtons.js'
export const paintOrderItem = (pedido) => {
  const table = pedido.nameTable || 'DOMICILIO'
  const cliente = pedido.user[0].name || pedido.user.name
  const horaCreacion = new Date(pedido.createdAt).toLocaleString()
  const tiempoTranscurrido = Math.floor(
    (Date.now() - new Date(pedido.createdAt)) / 60000
  )
  const productos = pedido.products.map((producto) => producto.title).join(', ')
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
