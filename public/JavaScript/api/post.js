import { showToast } from '../helpers/showToast.js'
import { postRequest } from './requestHandler.js'
import {
  paintOrderInDom,
  updateTableAmount,
  addPlateToDOM
} from '../logic/post/updateUIAfterPost.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
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
  window.location.href = '../../../index.html'
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
  const response = await postRequest(
    'users/login',
    formData,
    form,
    'default',
    'postLogin'
  )
  const userId = response.user._id
  window.location.href = '/pos.html#inventario'
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
  localStorage.removeItem('order')
  container?.remove()
}
/*import { showToast } from '../helpers/showToast.js'
import { postRequest, showError } from './requestHandler.js'
import {
  paintOrderInDom,
  updateTableAmount
} from '../logic/post/updateUIAfterPost.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
import { addPlateToDOM } from '../logic/post/updateUIAfterPost'
export const postPetition = async (form, url) => {
  try {
    const formData = new FormData(form)
    const res = await postRequest(url, formData, form)
    return res
  } catch (error) {
    showError('Error al registrar producto', error)
  }
}
export const postMenu = async (form) => {
  try {
    const formData = new FormData(form)
    const res = await postRequest(`plate/`, formData, form)
    addPlateToDOM(res)
    const ingredientInputs = document.querySelectorAll(
      '#ingredientInputs > div'
    )
    ingredientInputs.forEach((input) => input.remove())
  } catch (error) {
    showError('Error al registrar menú', error)
  }
}
export const postRegister = async (form) => {
  try {
    const formData = new FormData(form)
    await postRequest(`users/register`, formData, form)
    window.location.href = '../../../index.html'
  } catch (error) {
    showError('Error al registrar usuario', error)
  }
}
export const postLogin = async (form) => {
  try {
    const formData = new FormData(form)
    const email = formData.get('email')
    const password = formData.get('password')
    if (!email || !password)
      return howToast('Por favor, complete todos los campos.', 'error')
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!passwordPattern.test(password))
      return showToast(
        'La contraseña debe contener al menos un número, una letra mayúscula y una letra minúscula, y tener al menos 8 caracteres.',
        'error'
      )
    const response = await postRequest(`users/login`, formData, form)
    const userId = response.user._id
    window.location.href = '/pos.html#inventario'
  } catch (error) {
    showError('Error al iniciar sesión', error)
  }
}
export const postOrder = async (order, container) => {
  const payload = {
    nameTable: order.nameTable,
    products: order.products.map((p) => p.id),
    total: order.total
  }
  try {
    const res = await postRequest('pedidos', payload, null, 'no-store')
    updateTableAmount('tablaInventario', res.products)
    paintOrderInDom(res)
    requestAnimationFrame(() => triggerCheckAndPlaySound())
    localStorage.removeItem('order')
    container?.remove()
  } catch (error) {
    showError('Error al registrar pedido', error)
  }
}*/
