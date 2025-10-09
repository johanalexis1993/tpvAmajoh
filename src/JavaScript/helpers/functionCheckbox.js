import { togglePlateButtons } from './togglePlateButtons.js'
const addCheckboxesToPlates = (container) => {
  document.querySelectorAll(container).forEach((plato) => {
    if (!plato.querySelector('.plato-checkbox')) {
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.classList.add('plato-checkbox')
      checkbox.dataset.id = plato.getAttribute('data-id')
      checkbox.dataset.title = plato.querySelector('h3').textContent
      plato.insertBefore(checkbox, plato.firstChild)
    }
  })
}
const restoreSelectedPlates = () => {
  let platosSeleccionadosStorage = localStorage.getItem('platosSeleccionados')
  if (!platosSeleccionadosStorage) {
    platosSeleccionadosStorage = JSON.stringify({ products: [] })
    localStorage.setItem('platosSeleccionados', platosSeleccionadosStorage)
  }
  const platosSeleccionados = JSON.parse(platosSeleccionadosStorage)
  platosSeleccionados.products.forEach((productId) => {
    const checkbox = document.querySelector(`input[data-id="${productId.id}"]`)
    if (checkbox) checkbox.checked = true
  })
}
const handleCheckboxChange = (e) => {
  if (e.target.classList.contains('plato-checkbox')) {
    const productId = e.target.dataset.id
    const productTitle = e.target.dataset.title
    let platosSeleccionados = JSON.parse(
      localStorage.getItem('platosSeleccionados')
    ) || { products: [] }
    const productIndex = platosSeleccionados.products.findIndex(
      (product) => product.id === productId
    )
    if (e.target.checked) {
      if (productIndex === -1)
        platosSeleccionados.products.push({
          id: productId,
          title: productTitle
        })
    } else {
      if (productIndex !== -1)
        platosSeleccionados.products.splice(productIndex, 1)
    }
    localStorage.setItem(
      'platosSeleccionados',
      JSON.stringify(platosSeleccionados)
    )
  }
}
const handleUpdateClick = (updateBtn, originalText) => {
  localStorage.removeItem('platosSeleccionados')
  const checkboxes = document.querySelectorAll('.plato-checkbox')
  checkboxes.forEach((checkbox) => checkbox.remove())
  updateBtn.textContent = originalText
  document.removeEventListener('change', handleCheckboxChange)
}
export const functionCheckbox = (updateBtnSelector, containerSelector) => {
  togglePlateButtons(true)
  const updateBtn = document.querySelector(updateBtnSelector)
  if (updateBtn) {
    const originalText = updateBtn.textContent
    updateBtn.textContent = 'Enviar'
    addCheckboxesToPlates(containerSelector)
    restoreSelectedPlates()
    const handleClickUpdate = () => handleUpdateClick(updateBtn, originalText)
    updateBtn.addEventListener('click', handleClickUpdate, { once: true })
    document.addEventListener('change', handleCheckboxChange)
  }
}
