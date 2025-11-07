import { orderPainting } from './orderPainting.js'
import { processPlatesData } from './processPlatesData.js'
import { actualizarTabla } from './updateTables.js'
import { get } from '../../storage/indexedDB'
export const hydrateOrders = async () => {
  const open = await get('orders:open', [])
  const paid = await get('orders:paid', [])
  //console.log('[FROM-IDB] orders to paint', { open, paid })
  orderPainting(open, 'ordersOpen')
  orderPainting(paid, 'orderPaid')
}
export const hydratePlates = async () => {
  const available = await get('plates:available', [])
  const unavailable = await get('plates:unavailable', [])
  //console.log('[FROM-IDB] plates to paint', { available, unavailable })
  processPlatesData('platos-lista', available)
  processPlatesData('unavailables', unavailable)
}
export const hydrateTable = async (tablaId) => {
  const id = await get(`tableId:${tablaId}`, [])
  const data = await get(`tableData:${tablaId}`, [])
  const cols = await get(`tableColumns:${tablaId}`, [])
  /*console.log(`[FROM-IDB] DATA to paint for tablaId ${tablaId}`, {
    id,
    data,
    cols
  })*/
  actualizarTabla(tablaId, data, cols)
}
