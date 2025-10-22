import { putOrder, updateOrderStatus } from '../../api/put.js'
import { functionCheckbox } from '../../helpers/functionCheckbox.js'
import { togglePlateButtons } from '../../helpers/togglePlateButtons.js'
import { triggerCheckAndPlaySound } from '../../helpers/checkAndPlaySound.js'
import { showToast } from '../../helpers/showToast.js'
import { moveOrderElement } from './updateUIAfterPut.js'
import { generateReceipt } from '../../helpers/generatePDF.js'
let comandaActualizada = false
export const createAndConfigureButtons = (pedido, pedidoItem) => {
  if (pedido.status === 'Cobrada') return
  const aceptarBtn = document.createElement('button')
  aceptarBtn.textContent =
    pedido.status === 'Pendiente'
      ? 'Aceptar'
      : pedido.status === 'Listo'
      ? 'Cobrar'
      : 'Listo'
  aceptarBtn.setAttribute('data-order-id', pedido._id)
  aceptarBtn.setAttribute('data-status', pedido.status)
  pedidoItem.append(aceptarBtn)
  const select = document.createElement('select')
  select.id = `select-payment-method-${pedido._id}`
  const options = [
    { value: '', text: 'Seleccione método', disabled: true, selected: true },
    { value: 'Tarjeta', text: 'Tarjeta' },
    { value: 'Efectivo', text: 'Efectivo' },
    { value: 'Maquinas Recreativas', text: 'Máquinas Recreativas' },
    { value: 'Glovo', text: 'Glovo' }
  ]
  options.forEach((optionData) => {
    const option = document.createElement('option')
    option.value = optionData.value
    option.textContent = optionData.text
    if (optionData.disabled) option.disabled = true
    if (optionData.selected) option.selected = true
    select.append(option)
  })
  aceptarBtn.addEventListener('click', () => {
    const orderId = aceptarBtn.getAttribute('data-order-id')
    const currentStatus = aceptarBtn.getAttribute('data-status')
    if (aceptarBtn.textContent === 'Cobrar') {
      const selectElement = document.querySelector(
        `#select-payment-method-${pedido._id}`
      )
      if (selectElement && selectElement.value === '')
        return showToast('Por favor, seleccione un método de pago.', 'error')
      const paymentMethod = selectElement.value
      updateOrderStatus(orderId, currentStatus, aceptarBtn, paymentMethod)
      if (!pedido.nameTable) {
        generateReceipt(pedido, paymentMethod)
      } else {
        const userConfirmed = confirm('¿Necesitas el recibo?')
        if (userConfirmed) generateReceipt(pedido, paymentMethod)
      }
    } else {
      updateOrderStatus(orderId, currentStatus, aceptarBtn)
    }
    requestAnimationFrame(() => triggerCheckAndPlaySound())
    moveOrderElement(orderId)
  })
  if (pedido.nameTable) {
    const updateBtn = document.createElement('button')
    updateBtn.textContent = 'Añadir'
    updateBtn.setAttribute('data-order-id', pedido._id)
    updateBtn.id = `update-btn-${pedido._id}`
    pedidoItem.append(updateBtn)
    pedidoItem.append(select)
    updateBtn.addEventListener('click', () => {
      const orderId = updateBtn.getAttribute('data-order-id')
      comandaActualizada
        ? (putOrder(orderId, updateBtn),
          togglePlateButtons(false),
          (comandaActualizada = false))
        : (functionCheckbox(
            `#update-btn-${pedido._id}`,
            '#platos-lista .has-tooltip'
          ),
          (comandaActualizada = true))
    })
  }
}
