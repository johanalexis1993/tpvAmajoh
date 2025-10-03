import { paintOrderItem } from '../put/paintOrderItem.js'
export const orderPainting = (res, ordersOpen) => {
  const ordersOpenDiv = document.querySelector(`#${ordersOpen}`)
  ordersOpenDiv.innerHTML = ''
  const ul = document.createElement('ul')
  if (res && res.length > 0) {
    res.forEach((pedido) => {
      const pedidoItem = paintOrderItem(pedido)
      ul.append(pedidoItem)
    })
  }
  ordersOpenDiv.append(ul)
}
