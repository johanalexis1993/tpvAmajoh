import { showSection } from './showSection.js'
const routes = {
  agregarPlato: 'agregarPlato',
  inventario: 'inventario',
  caja: 'caja',
  reservation: 'reservation',
  list: 'list',
  unavailablePlates: 'unavailablePlates',
  Losses: 'Losses',
  clientes: 'clientes',
  orderPaid: 'orderPaid',
  gestionPersonal: 'gestionPersonal',
  estadisticasVentas: 'estadisticasVentas',
  configuracionTPV: 'configuracionTPV',
  reportesFinancieros: 'reportesFinancieros',
  configuracionRestaurante: 'configuracionRestaurante',
  ayuda: 'ayuda'
}
const initApp = () => {
  requestIdleCallback(() => {
    const currentSectionId =
      localStorage.getItem('currentSectionId') || 'inventario'
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      const sectionId = routes[hash] || 'inventario'
      showSection(sectionId)
      localStorage.setItem('currentSectionId', sectionId)
    }
    window.location.hash ? handleHashChange() : showSection(currentSectionId)
    window.addEventListener('hashchange', handleHashChange)
  })
}
initApp()
