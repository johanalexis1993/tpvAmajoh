import '../../JavaScript/helpers/checkAuth.js'
import '../../JavaScript/app/initApp.js'
import '../../JavaScript/app/sidebar.js'
import '../../JavaScript/app/sseOrders.js'
import '../../JavaScript/routesAndEvents/getHandlers.js'
import '../../JavaScript/routesAndEvents/postHandlers.js'
import '../../JavaScript/routesAndEvents/putHandlers.js'
import '../../JavaScript/routesAndEvents/deleteAndPutHandlers.js'
import '../../JavaScript/helpers/addIngredient.js'
import '../../JavaScript/helpers/inputFile.js'
import { get } from '../../JavaScript/storage/indexedDB'
import { renderOrder } from '../../JavaScript/logic/post/renderOrder.js'
//esta funcion no hace nada de perf¡cistencia
requestIdleCallback(async () => {
  const order = await get('order')
  if (order?.products?.length) renderOrder(order)
})
