import '../../JavaScript/helpers/checkAuth.js'
import '../../JavaScript/POSoperation/initApp.js'
import '../../JavaScript/POSoperation/sidebar.js'
import '../../JavaScript/POSoperation/sseOrders.js'
import '../../JavaScript/events/getHandlers.js'
import '../../JavaScript/events/postHandlers.js'
import '../../JavaScript/events/putHandlers.js'
import '../../JavaScript/events/deleteAndPutHandlers.js'
import '../../JavaScript/helpers/addIngredient.js'
import '../../JavaScript/helpers/inputFile.js'
import { LS } from '../../JavaScript/storage/hydrateFromStore.js'
import { renderOrder } from '../../JavaScript/logic/post/renderOrder.js'
requestIdleCallback(async () => {
  const order = await LS.get('order')
  if (order?.products?.length) renderOrder(order)
})
