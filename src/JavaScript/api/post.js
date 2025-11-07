import { showToast } from '../helpers/showToast.js'
import { postRequest } from './requestHandler.js'
import {
  paintOrderInDom,
  updateTableAmount,
  addPlateToDOM
} from '../logic/post/updateUIAfterPost.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
import { set, del } from '../storage/indexedDB'
export const postPetition = async (form, url) => {
  const formData = new FormData(form)
  const res = await postRequest(
    url,
    formData,
    form,
    'default',
    `postPetition(${url})`
  )
  return res
}
export const postMenu = async (form) => {
  const formData = new FormData(form)
  const res = await postRequest('plate/', formData, form, 'default', 'postMenu')
  addPlateToDOM(res)
  const ingredientInputs = document.querySelectorAll('#ingredientInputs > div')
  ingredientInputs.forEach((input) => input.remove())
}
export const postRegister = async (form) => {
  const formData = new FormData(form)
  await postRequest('users/register', formData, form, 'default', 'postRegister')
  window.location.href = '/index.html'
}
export const postLogin = async (form) => {
  const formData = new FormData(form)
  const email = formData.get('email')
  const password = formData.get('password')
  if (!email || !password)
    return showToast('Por favor, complete todos los campos.', 'error')
  const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  if (!passwordPattern.test(password)) {
    return showToast(
      'La contraseña debe contener al menos un número, una letra mayúscula y una letra minúscula, y tener al menos 8 caracteres.',
      'error'
    )
  }
  await postRequest('users/login', formData, form, 'default', 'postLogin')
  await set('nav:currentSectionId', 'inventario')
  window.location.href = '/pos.html'
}
export const postLogout = async () => {
  await postRequest('users/logout', undefined, null, 'no-store')
  window.location.replace('/index.html')
}
export const postOrder = async (order, container) => {
  const payload = {
    nameTable: order.nameTable,
    products: order.products.map((p) => p.id),
    total: order.total
  }
  const res = await postRequest(
    'pedidos',
    payload,
    null,
    'no-store',
    'postOrder'
  )
  updateTableAmount('tablaInventario', res.products)
  paintOrderInDom(res)
  requestAnimationFrame(() => triggerCheckAndPlaySound())
  await del('order')
  container?.remove()
}
