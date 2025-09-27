import { putRequest, getRequest } from './requestHandler.js'
import {
  updateLine,
  updateOrderInDOM,
  movePlateElement,
  removeProductInDom
} from '../logic/put/updateUIAfterPut.js'
import { updateAmount } from '../logic/post/updateUIAfterPost.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
export const editarElemento = async (url, id, tablaId, columnas) => {
  const formData = new FormData()
  const tabla = document.querySelector(`#${tablaId}`)
  const filas = tabla.querySelectorAll('tbody tr')
  let celdasFilaActual = null
  for (const fila of filas) {
    const celdas = fila.querySelectorAll('td')
    if (celdas[columnas.id].getAttribute('data-id') === id) {
      celdasFilaActual = celdas
      for (const columna of columnas.editables) {
        let valor = celdas[columna.indice].innerText
        const precioSinSimbolo = valor.replace(/[^\d.]/g, '')
        valor = prompt(
          `Ingrese el nuevo ${columna.nombre}:`,
          columna.nombre === 'precio' ? precioSinSimbolo : valor
        )
        if (columna.nombre === 'reservationDate') {
          const [day, month, year] = valor.split('-')
          valor = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
        formData.append(columna.nombre, valor)
      }
      const res = await putRequest(
        url,
        id,
        formData,
        `editarElemento(${tablaId})`
      )
      if (tablaId === 'tablaMerma') updateAmount(res, 'tablaInventario', 'PUT')
      updateLine(columnas, formData, celdasFilaActual)
      if (tablaId === 'tablaInventario') removeProductInDom(res, id)
      return res
    }
  }
}
export const putOrder = async (orderId, button) => {
  const platosSeleccionados = JSON.parse(
    localStorage.getItem('platosSeleccionados')
  ) || { products: [] }
  const formData = new FormData()
  const productTitles = platosSeleccionados.products.map(
    (product) => product.title
  )
  platosSeleccionados.products.forEach((product, index) =>
    formData.append(`products[${index}]`, product.id)
  )
  const updatedOrder = await putRequest(
    'pedidos',
    orderId,
    formData,
    'putOrder'
  )
  updateOrderInDOM(button, updatedOrder, productTitles, 'Productos')
}
export const updateOrderStatus = async (
  orderId,
  currentStatus,
  button,
  paymentMethod = null
) => {
  let newStatus =
    currentStatus === 'Pendiente'
      ? 'Preparando'
      : currentStatus === 'Preparando'
      ? 'Listo'
      : 'Cobrada'
  const formData = new FormData()
  formData.append('status', newStatus)
  if (newStatus === 'Cobrada' && paymentMethod)
    formData.append('paymentMethod', paymentMethod)
  const res = await putRequest(
    'pedidos',
    orderId,
    formData,
    'updateOrderStatus'
  )
  updateOrderInDOM(button, res, [], 'Estado')
  requestAnimationFrame(() => triggerCheckAndPlaySound())
}
export const toggleStockStatus = async () => {
  const platosSeleccionados = JSON.parse(
    localStorage.getItem('platosSeleccionados')
  )
  const selectedProducts = platosSeleccionados.products
  for (const product of selectedProducts) {
    const productId = product.id
    const productResponse = await getRequest(
      `plate/${productId}`,
      'default',
      'toggleStockStatus:get'
    )
    const currentStock = productResponse.stock
    const category = productResponse.category
    const newStock = currentStock === 'available' ? 'unavailable' : 'available'
    const formData = new FormData()
    formData.append('stock', newStock)
    await putRequest('plate', productId, formData, 'toggleStockStatus:put')
    movePlateElement(productId, newStock, category)
  }
}
/*import { putRequest, getRequest, showError } from './requestHandler.js'
import {
  updateLine,
  updateOrderInDOM,
  movePlateElement,
  removeProductInDom
} from '../logic/put/updateUIAfterPut.js'
import { updateAmount } from '../logic/post/updateUIAfterPost.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
export const editarElemento = async (url, id, tablaId, columnas) => {
  try {
    const formData = new FormData()
    const tabla = document.querySelector(`#${tablaId}`)
    const filas = tabla.querySelectorAll('tbody tr')
    let celdasFilaActual = null
    for (const fila of filas) {
      const celdas = fila.querySelectorAll('td')
      if (celdas[columnas.id].getAttribute('data-id') === id) {
        celdasFilaActual = celdas
        for (const columna of columnas.editables) {
          let valor = celdas[columna.indice].innerText
          const precioSinSimbolo = valor.replace(/[^\d.]/g, '')
          valor = prompt(
            `Ingrese el nuevo ${columna.nombre}:`,
            columna.nombre === 'precio' ? precioSinSimbolo : valor
          )
          if (columna.nombre === 'reservationDate') {
            const [day, month, year] = valor.split('-')
            valor = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          }
          formData.append(columna.nombre, valor)
        }
        const res = await putRequest(url, id, formData)
        if (tablaId === 'tablaMerma')
          updateAmount(res, 'tablaInventario', 'PUT')
        updateLine(columnas, formData, celdasFilaActual)
        if (tablaId === 'tablaInventario') removeProductInDom(res, id)
        return res
      }
    }
  } catch (error) {
    showError('Error al editar elemento', error)
  }
}
export const putOrder = async (orderId, button) => {
  try {
    const platosSeleccionados = JSON.parse(
      localStorage.getItem('platosSeleccionados')
    ) || { products: [] }
    const formData = new FormData()
    const productTitles = platosSeleccionados.products.map(
      (product) => product.title
    )
    platosSeleccionados.products.forEach((product, index) =>
      formData.append(`products[${index}]`, product.id)
    )
    const updatedOrder = await putRequest('pedidos', orderId, formData)
    updateOrderInDOM(button, updatedOrder, productTitles, 'Productos')
  } catch (error) {
    showError('Error al actualizar pedido', error)
  }
}
export const updateOrderStatus = async (
  orderId,
  currentStatus,
  button,
  paymentMethod = null
) => {
  try {
    let newStatus =
      currentStatus === 'Pendiente'
        ? 'Preparando'
        : currentStatus === 'Preparando'
        ? 'Listo'
        : 'Cobrada'
    const formData = new FormData()
    formData.append('status', newStatus)
    if (newStatus === 'Cobrada' && paymentMethod)
      formData.append('paymentMethod', paymentMethod)
    const res = await putRequest('pedidos', orderId, formData)
    updateOrderInDOM(button, res, [], 'Estado')
    requestAnimationFrame(() => triggerCheckAndPlaySound())
  } catch (error) {
    showError('Error al actualizar el estado del pedido', error)
  }
}
export const toggleStockStatus = async () => {
  try {
    const platosSeleccionados = JSON.parse(
      localStorage.getItem('platosSeleccionados')
    )
    const selectedProducts = platosSeleccionados.products
    for (const product of selectedProducts) {
      const productId = product.id
      const productResponse = await getRequest(`plate/${productId}`)
      const currentStock = productResponse.stock
      const category = productResponse.category
      const newStock =
        currentStock === 'available' ? 'unavailable' : 'available'
      const formData = new FormData()
      formData.append('stock', newStock)
      await putRequest(`plate`, productId, formData)
      movePlateElement(productId, newStock, category)
    }
  } catch (error) {
    showError('Error al cambiar el estado del stock', error)
  }
}*/
