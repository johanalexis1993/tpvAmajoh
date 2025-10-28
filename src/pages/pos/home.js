import '../../JavaScript/helpers/checkAuth.js'
import '../../JavaScript/app/initApp.js'
import '../../JavaScript/app/sidebar.js'
import '../../JavaScript/app/sseOrders.js'
import '../../JavaScript/events/getHandlers.js'
import '../../JavaScript/events/postHandlers.js'
import '../../JavaScript/events/putHandlers.js'
import '../../JavaScript/events/deleteAndPutHandlers.js'
import '../../JavaScript/helpers/addIngredient.js'
import '../../JavaScript/helpers/inputFile.js'
import { LS } from '../../JavaScript/storage/indexedDB'
import { renderOrder } from '../../JavaScript/logic/post/renderOrder.js'
requestIdleCallback(async () => {
  const order = await LS.get('order')
  if (order?.products?.length) renderOrder(order)
})
