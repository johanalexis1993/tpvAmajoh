import { postRequest, showError } from './requestHandler'
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
    await postRequest(`users/register`, formData, form, false)
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
      return alert('Por favor, complete todos los campos.')
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!passwordPattern.test(password))
      return alert(
        'La contraseña debe contener al menos un número, una letra mayúscula y una letra minúscula, y tener al menos 8 caracteres.'
      )
    const response = await postRequest(`users/login`, formData, form, false)
    const userId = response.user._id
    const token = response.token
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    window.location.href = '/TPV.html#inventario'
  } catch (error) {
    showError('Error al iniciar sesión', error)
  }
}
export const postOrder = async (order, container) => {
  const formData = new FormData()
  formData.append('nameTable', order.nameTable)
  formData.append('user[]', order.user)
  order.products.forEach((product, index) =>
    formData.append(`products[${index}]`, product.id)
  )
  try {
    const res = await postRequest(`pedidos/`, formData, null)
    console.log(res.products)
    updateTableAmount('tablaInventario', res.products)
    paintOrderInDom(res)
    requestAnimationFrame(() => triggerCheckAndPlaySound())
    localStorage.removeItem('order')
    container.remove()
  } catch (error) {
    showError('Error al registrar pedido', error)
  }
}
