import { paintOrderItem } from '../put/paintOrderItem.js'
export const orderPainting = (res, pedidos) => {
  const pedidosDiv = document.querySelector(`#${pedidos}`)
  pedidosDiv.innerHTML = ''
  const ul = document.createElement('ul')
  if (res && res.length > 0) {
    res.forEach((pedido) => {
      const pedidoItem = paintOrderItem(pedido)
      ul.append(pedidoItem)
    })
  }
  pedidosDiv.append(ul)
}
