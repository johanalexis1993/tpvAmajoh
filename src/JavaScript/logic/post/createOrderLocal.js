import { renderOrder } from './renderOrder.js'
import { get, set } from '../../storage/indexedDB'
export const createOrderLocal = async (plato) => {
  const KEY = 'order'
  let order = await get(KEY, { nameTable: '', products: [], total: 0 })
  if (order.products.length === 0) {
    const nombre = prompt('Por favor, ingresa el nombre de la comanda:')
    if (nombre === null) return console.log('Operación cancelada.')
    order.nameTable = nombre
    const listaPlatos = document.querySelector('#ordersOpen')
    const ol = document.createElement('ol')
    listaPlatos.append(ol)
  }
  order.products.push({ id: plato._id, title: plato.title, price: plato.price })
  order.total += plato.price
  await set(KEY, order)
  renderOrder(order)
}
