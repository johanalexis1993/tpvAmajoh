import { renderOrder } from './renderOrder.js'
export const createOrderLocal = (plato) => {
  localStorage.removeItem('order')
  let order = JSON.parse(localStorage.getItem('order')) || {
    nameTable: '',
    user: localStorage.getItem('userId'),
    products: [],
    total: 0
  }
  if (order.products.length === 0) {
    const nombreComanda = prompt('Por favor, ingresa el nombre de la comanda:')
    if (nombreComanda === null)
      return console.log('Operación cancelada por el usuario.')
    order.nameTable = nombreComanda
    const listaPlatos = document.querySelector('#pedidos')
    const ol = document.createElement('ol')
    listaPlatos.append(ol)
  }
  if (!order.user) {
    const userId = localStorage.getItem('userId')
    if (!userId)
      return console.error(
        'El id del usuario no está presente en el localStorage'
      )
    order.user = userId
  }
  order.products.push({
    id: plato._id,
    title: plato.title,
    price: plato.price
  })
  order.total += plato.price
  localStorage.setItem('order', JSON.stringify(order))
  renderOrder(order)
}
