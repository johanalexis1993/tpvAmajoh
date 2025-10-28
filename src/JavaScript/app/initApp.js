import { showSection } from './showSection.js'
import { LS } from '../storage/indexedDB'
import '../helpers/watermark.js'
const routes = {
  agregarPlato: 'agregarPlato',
  inventario: 'inventario',
  caja: 'caja',
  reservation: 'reservation',
  list: 'list',
  unavailablePlates: 'unavailablePlates',
  losses: 'losses',
  clientes: 'clientes',
  orderPaid: 'orderPaid',
  gestionPersonal: 'gestionPersonal',
  estadisticasVentas: 'estadisticasVentas',
  configuracionTPV: 'configuracionTPV',
  reportesFinancieros: 'reportesFinancieros',
  configuracionRestaurante: 'configuracionRestaurante',
  ayuda: 'ayuda'
}
const setSection = (id, { updateHash = false } = {}) => {
  updateHash && location.hash !== `#${id}` && location.replace(`#${id}`)
  showSection(id)
  LS.set('nav:currentSectionId', id)
}
const handleHashChange = () => {
  const id = routes[location.hash.slice(1)] || 'inventario'
  setSection(id)
}
const initApp = () => {
  requestIdleCallback(() => {
    const isReload =
      performance.getEntriesByType('navigation')[0]?.type === 'reload'
    isReload
      ? setSection('inventario', { updateHash: true })
      : handleHashChange()
    addEventListener('hashchange', handleHashChange)
  })
}
initApp()
