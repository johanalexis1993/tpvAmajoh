import { toggleBlinkingEffect } from '../../helpers/checkAndPlaySound'
import { createOrUpdateCategoryContainer } from '../get/paintingPlates'
export const updateLine = (columnas, formData, celdas) => {
  for (const [key, value] of formData.entries()) {
    const columna = columnas.editables.find((col) => col.nombre === key)
    if (columna) {
      if (columna.nombre === 'reservationDate') {
        const fecha = new Date(value)
        const fechaFormateada = fecha
          .toLocaleDateString('es-ES')
          .replace(/\//g, '-')
        celdas[columna.indice].innerText = fechaFormateada
      } else if (columna.nombre === 'precio') {
        celdas[columna.indice].innerText = `${value}€`
      } else {
        celdas[columna.indice].innerText = value
      }
    }
  }
}
export const updateOrderInDOM = (button, res, productTitles = [], word) => {
  const pElements = button.parentElement.querySelectorAll('p')
  const Elemento = Array.from(pElements).find((p) =>
    p.textContent.includes(`${word}:`)
  )
  if (word === 'Estado') {
    Elemento.textContent = `Estado: ${res.status}`
    button.textContent =
      res.status === 'Preparando'
        ? 'Listo'
        : res.status === 'Listo'
        ? 'Cobrar'
        : 'Cobrada'
    if (res.status === 'Cobrada') button.disabled = true
    button.dataset.status = res.status
    const summary = button.closest('details').querySelector('summary')
    toggleBlinkingEffect(summary, res.status === 'Pendiente')
  } else if (word === 'Productos') {
    const existingProducts = Elemento.textContent
      .replace('Productos: ', '')
      .split(', ')
      .filter((product) => product !== '')
    const allProducts = [...new Set([...existingProducts, ...productTitles])]
    Elemento.textContent = `Productos: ${allProducts.join(', ')}`
  }
}
export const movePlateElement = (productId, newStock, category) => {
  const plateElement = document.querySelector(`li[data-id="${productId}"]`)
  if (!plateElement) return
  const oldContainerId =
    newStock === 'available' ? 'unavailables' : 'platos-lista'
  const oldContainer = document.querySelector(`#${oldContainerId}`)
  const oldUl = createOrUpdateCategoryContainer(oldContainer, category)
  if (oldUl) oldUl.removeChild(plateElement)
  if (oldUl.children.length === 0) {
    oldContainer.removeChild(oldUl.previousElementSibling)
    oldContainer.removeChild(oldUl)
  }
  const newContainerId =
    newStock === 'available' ? 'platos-lista' : 'unavailables'
  const newContainer = document.querySelector(`#${newContainerId}`)
  const newUl = createOrUpdateCategoryContainer(newContainer, category)
  newUl.append(plateElement)
}
export const moveOrderElement = (orderId) => {
  const orderButton = document.querySelector(
    `button[data-order-id="${orderId}"]`
  )
  if (!orderButton) return
  const orderItem = orderButton.closest('li')
  if (!orderItem) return
  const currentStatus = orderButton.getAttribute('data-status')
  const newStatus = currentStatus === 'Listo' ? 'Cobrada' : currentStatus
  const newContainerId = newStatus === 'Cobrada' ? 'orderPaid' : 'pedidos'
  orderButton.setAttribute('data-status', newStatus)
  const newContainer = document.querySelector(`#${newContainerId}`)
  if (!newContainer) return
  let newUl = newContainer.querySelector('ul')
  if (!newUl) {
    newUl = document.createElement('ul')
    newContainer.append(newUl)
  }
  newUl.append(orderItem)
}
export const removeProductInDom = (res, id) => {
  if (res._id !== id)
    return console.error(
      `Product ID mismatch: expected '${id}', got '${res._id}'`
    )
  const threshold = 0.4
  const maxAmount = res.maxAmount
  const cantidad = res.cantidad
  if (cantidad > maxAmount * threshold) {
    const productElement = document.querySelector(`details[data-id="${id}"]`)
    if (productElement) productElement.remove()
  }
}
