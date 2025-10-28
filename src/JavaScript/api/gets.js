import { getRequest } from './requestHandler.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
import { renderChart } from '../helpers/renderChart.js'
import { renderList } from '../logic/get/renderList.js'
import {
  hydrateOrders,
  hydratePlates,
  hydrateTable
} from '../logic/get/hydration.js'
import { LS } from '../storage/indexedDB'
export const peticion = async (
  url,
  tablaId,
  columnas,
  page = 1,
  limit = 20
) => {
  const res =
    (await getRequest(
      `${url}?page=${page}&limit=${limit}`,
      'default',
      'peticion→actualizarTabla'
    )) || {}
  await LS.batchSet({
    [`tableId:${tablaId}`]: tablaId,
    [`tableData:${tablaId}`]: res,
    [`tableColumns:${tablaId}`]: columnas
  })
  await hydrateTable(tablaId)
}
export const orders = async (url) => {
  const { paidOrders = [], openOrders = [] } =
    (await getRequest(url, 'default', 'orders')) || {}
  await LS.batchSet({
    'orders:open': openOrders,
    'orders:paid': paidOrders
  })
  await hydrateOrders()
  requestAnimationFrame(() => triggerCheckAndPlaySound())
}
export const getDishes = async (url) => {
  const { availablePlates = [], unavailablePlates = [] } =
    (await getRequest(url, 'no-store', 'getDishes')) || {}
  await LS.batchSet({
    'plates:available': availablePlates,
    'plates:unavailable': unavailablePlates
  })
  await hydratePlates()
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
