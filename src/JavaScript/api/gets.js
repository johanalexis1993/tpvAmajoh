import { getRequest } from './requestHandler.js'
import { actualizarTabla } from '../logic/get/updateTables.js'
import { processPlatesData } from '../logic/get/processPlatesData.js'
import { orderPainting } from '../logic/get/orderPainting.js'
import { triggerCheckAndPlaySound } from '../helpers/checkAndPlaySound.js'
import { renderChart } from '../helpers/renderChart.js'
import { renderList } from '../logic/get/renderList.js'
import { LS } from '../storage/hydrateFromStore.js'
/*----------------------------------------------------------*/
/*import { LS } from '../storage/hydrateFromStore.js'*/
const hydrateFromStore = async () => {
  const open = await LS.get('orders:open', [])
  const paid = await LS.get('orders:paid', [])
  console.log('[FROM-IDB] orders to paint', { open, paid })
  orderPainting(open, 'ordersOpen')
  orderPainting(paid, 'orderPaid')
}
const hydrateFromStore2 = async () => {
  const available = await LS.get('plates:available', [])
  const unavailable = await LS.get('plates:unavailable', [])
  console.log('[FROM-IDB] plates to paint', { available, unavailable })
  processPlatesData('platos-lista', available)
  processPlatesData('unavailables', unavailable)
}
const hydrateFromStore3 = async (tablaId) => {
  const id = await LS.get(`tableId:${tablaId}`, [])
  const data = await LS.get(`tableData:${tablaId}`, [])
  const cols = await LS.get(`tableColumns:${tablaId}`, [])
  console.log(`[FROM-IDB] DATA to paint for tablaId ${tablaId}`, {
    id,
    data,
    cols
  })
  actualizarTabla(tablaId, data, cols)
}
/*----------------------------------------------------------*/
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
  await hydrateFromStore3(tablaId)
}
export const orders = async (url) => {
  const { paidOrders = [], openOrders = [] } =
    (await getRequest(url, 'default', 'orders')) || {}
  await LS.batchSet({
    'orders:open': openOrders,
    'orders:paid': paidOrders
  })
  hydrateFromStore()
  requestAnimationFrame(() => triggerCheckAndPlaySound())
}
export const getDishes = async (url) => {
  const { availablePlates = [], unavailablePlates = [] } =
    (await getRequest(url, 'no-store', 'getDishes')) || {}
  await LS.batchSet({
    'plates:available': availablePlates,
    'plates:unavailable': unavailablePlates
  })
  hydrateFromStore2()
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
