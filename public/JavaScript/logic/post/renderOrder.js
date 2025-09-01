import { postOrder } from '../../api/post'
export const renderOrder = (order) => {
  const container = document.querySelector('#pedidos ol')
  container.innerHTML = ''
  const fragment = document.createDocumentFragment()
  const createListItem = (text) => {
    const listItem = document.createElement('li')
    listItem.textContent = text
    return listItem
  }
  const nombreComandaElement = document.createElement('h4')
  nombreComandaElement.textContent = `Nombre de la comanda: ${order.nameTable}`
  fragment.append(nombreComandaElement)
  const productList = document.createElement('ul')
  order.products.forEach((product) =>
    productList.append(
      createListItem(`${product.title} - Precio: $${product.price}`)
    )
  )
  fragment.append(
    productList,
    createListItem(`Total: $${order.total}`),
    createListItem(`Usuario: ${order.user}`)
  )
  const enviarButton = document.createElement('button')
  enviarButton.textContent = 'Enviar'
  enviarButton.addEventListener('click', () => postOrder(order, container))
  fragment.append(enviarButton)
  container.append(fragment)
}
