import { getRequest } from './requestHandler.js'
import { actualizarTabla } from '../logic/get/updateTables.js'
import { processPlatesData } from '../logic/get/processPlatesData.js'
import { orderPainting } from '../logic/get/orderPainting.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
import { renderChart } from '../helpers/renderChart.js'
import { renderList } from '../logic/get/renderList.js'
export const peticion = async (
  url,
  tablaId,
  columnas,
  page = 1,
  limit = 20
) => {
  const res = await getRequest(
    `${url}?page=${page}&limit=${limit}`,
    'default',
    'peticion→actualizarTabla'
  )
  actualizarTabla(tablaId, res, columnas)
}
export const orders = async (url) => {
  const res = await getRequest(url, 'default', 'orders')
  const { orderPaing, notOrderPaing } = res
  orderPainting(notOrderPaing, 'pedidos')
  orderPainting(orderPaing, 'orderPaid')
  requestAnimationFrame(() => triggerCheckAndPlaySound())
}
export const getDishes = async (url) => {
  const res = await getRequest(url, 'no-store', 'getDishes')
  const { availablePlates, unavailablePlates } = res
  processPlatesData('unavailables', unavailablePlates)
  processPlatesData('platos-lista', availablePlates)
}
const adaptProcessData = (id, res, processData, columns) =>
  columns ? processData(id, res, columns) : processData(id, res)
export const getTextBySearch = async (
  searchText,
  id,
  urlText,
  urlNum,
  processData,
  columns = null
) => {
  const url = isNaN(searchText)
    ? `${urlText}${searchText}`
    : `${urlNum}${searchText}`
  const res = await getRequest(url, 'default', 'getTextBySearch')
  adaptProcessData(id, res, processData, columns)
}
export const handleSearch = (
  inputSelector,
  searchEndpoint,
  containerId,
  titleEndpoint,
  callback,
  extraFields = [],
  defaultFetch = null
) => {
  document.querySelector(inputSelector).addEventListener('input', function () {
    const searchText = this.value.trim()
    if (searchText !== '') {
      getTextBySearch(
        searchText,
        containerId,
        searchEndpoint,
        titleEndpoint,
        callback,
        extraFields
      )
    } else if (defaultFetch) {
      defaultFetch()
    }
  })
}
export const getEmail = async (url, searchText) => {
  const direction = `${url}${searchText}`
  try {
    return await getRequest(direction, 'default', 'getEmail')
  } catch {
    return []
  }
}
export const toDoLists = async (url, text) => {
  const res = await getRequest(url, 'default', 'toDoLists')
  const { productsToBuy, productsToPrepare } = res
  renderList(productsToBuy, 'shoppingList', ['🛒 Lista de Compra'], text)
  renderList(productsToPrepare, 'mealPrepList', ['👨‍🍳 Elaborar'], text)
}
export const historialDeVentas = async (url, periodo) => {
  const res = await getRequest(url, 'default', 'historialDeVentas')
  renderChart(res, periodo, 'graficoVentas')
}
/*import { getRequest, showError } from './requestHandler.js'
import { actualizarTabla } from '../logic/get/updateTables.js'
import { processPlatesData } from '../logic/get/processPlatesData.js'
import { orderPainting } from '../logic/get/orderPainting.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
import { renderChart } from '../helpers/renderChart.js'
import { renderList } from '../logic/get/renderList.js'
export const peticion = async (
  url,
  tablaId,
  columnas,
  page = 1,
  limit = 20
) => {
  try {
    const res = await getRequest(`${url}?page=${page}&limit=${limit}`)
    actualizarTabla(tablaId, res, columnas)
  } catch (error) {
    showError('Error al actualizar la tabla', error)
  }
}
export const orders = async (url) => {
  try {
    const res = await getRequest(url)
    const { orderPaing, notOrderPaing } = res
    orderPainting(notOrderPaing, 'pedidos')
    orderPainting(orderPaing, 'orderPaid')
    requestAnimationFrame(() => triggerCheckAndPlaySound())
  } catch (error) {
    showError('Error al obtener pedidos', error)
  }
}
export const getDishes = async (url) => {
  try {
    const res = await getRequest(url, false)
    const { availablePlates, unavailablePlates } = res
    processPlatesData('unavailables', unavailablePlates)
    processPlatesData('platos-lista', availablePlates)
  } catch (error) {
    showError('Error al obtener platos', error)
  }
}
const adaptProcessData = (id, res, processData, columns) => {
  columns ? processData(id, res, columns) : processData(id, res)
}
export const getTextBySearch = async (
  searchText,
  id,
  urlText,
  urlNum,
  processData,
  columns = null
) => {
  let url
  isNaN(searchText)
    ? (url = `${urlText}${searchText}`)
    : (url = `${urlNum}${searchText}`)
  try {
    const res = await getRequest(url)
    adaptProcessData(id, res, processData, columns)
  } catch (error) {
    showError('Error al buscar platos', error)
  }
}
export const handleSearch = (
  inputSelector,
  searchEndpoint,
  containerId,
  titleEndpoint,
  callback,
  extraFields = [],
  defaultFetch = null
) => {
  document.querySelector(inputSelector).addEventListener('input', function () {
    const searchText = this.value.trim()
    if (searchText !== '') {
      getTextBySearch(
        searchText,
        containerId,
        searchEndpoint,
        titleEndpoint,
        callback,
        extraFields
      )
    } else if (defaultFetch) {
      defaultFetch()
    }
  })
}
export const getEmail = async (url, searchText) => {
  let direction = `${url}${searchText}`
  try {
    const res = await getRequest(direction)
    return res
  } catch (error) {
    showError('Error al buscar usuarios', error)
    return []
  }
}
export const toDoLists = async (url, text) => {
  try {
    const res = await getRequest(url)
    const { productsToBuy, productsToPrepare } = res
    renderList(productsToBuy, 'shoppingList', [`🛒 Lista de Compra`], text)
    renderList(productsToPrepare, 'mealPrepList', [`👨‍🍳 Elaborar`], text)
  } catch (error) {
    showError('Error al obtener pedidos', error)
  }
}
export const historialDeVentas = async (url, periodo) => {
  try {
    const res = await getRequest(url)
    renderChart(res, periodo, 'graficoVentas')
  } catch (error) {
    showError('Error al obtener pedidos', error)
  }
}*/
