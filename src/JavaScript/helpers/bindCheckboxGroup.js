import { togglePlateButtons } from './togglePlateButtons.js'
import { LS } from '../storage/indexedDB.js'
const KEY = 'platosSeleccionados'
const SELECTOR_CHECK = '.plato-checkbox'
const addCheckboxesToPlates = (container) => {
  document.querySelectorAll(container).forEach((plato) => {
    if (!plato.querySelector(SELECTOR_CHECK)) {
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.classList.add('plato-checkbox')
      checkbox.dataset.id = plato.getAttribute('data-id') || ''
      const h3 = plato.querySelector('h3')
      checkbox.dataset.title = (h3 && h3.textContent) || ''
      plato.insertBefore(checkbox, plato.firstChild)
    }
  })
}
const restoreSelectedPlates = async () => {
  const data = (await LS.get(KEY, null)) ?? { products: [] }
  const idsMarcados = new Set(data.products.map((p) => String(p.id)))
  document.querySelectorAll(SELECTOR_CHECK).forEach((cb) => {
    const id = String(cb.dataset.id || '')
    cb.checked = idsMarcados.has(id)
  })
}
const handleCheckboxChange = async (e) => {
  const checkbox = e.target
  if (
    !checkbox ||
    !checkbox.classList ||
    !checkbox.classList.contains('plato-checkbox')
  )
    return
  const state = (await LS.get(KEY, null)) ?? { products: [] }
  const id = String(checkbox.dataset.id || '')
  const title = String(checkbox.dataset.title || '')
  if (checkbox.checked) {
    const exists = state.products.some((p) => String(p.id) === id)
    if (!exists) state.products.push({ id, title })
  } else {
    state.products = state.products.filter((p) => String(p.id) !== id)
  }
  await LS.set(KEY, state)
}
const handleUpdateClick = async (btn, originalText) => {
  await LS.del(KEY)
  document
    .querySelectorAll(SELECTOR_CHECK)
    .forEach((checkbox) => checkbox.remove())
  btn.textContent = originalText
  document.removeEventListener('change', handleCheckboxChange)
}
export const functionCheckbox = (updateBtnSelector, containerSelector) => {
  togglePlateButtons(true)
  const updateBtn = document.querySelector(updateBtnSelector)
  if (!updateBtn) return
  const originalText = updateBtn.textContent
  updateBtn.textContent = 'Enviar'
  addCheckboxesToPlates(containerSelector)
  restoreSelectedPlates()
  const onClick = () => handleUpdateClick(updateBtn, originalText)
  updateBtn.addEventListener('click', onClick, { once: true })
  document.addEventListener('change', handleCheckboxChange)
}
