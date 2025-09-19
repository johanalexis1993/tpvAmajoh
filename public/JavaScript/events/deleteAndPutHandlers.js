import { eliminarElemento } from '../api/delete.js'
import { editarElemento } from '../api/put.js'
import { deleteLine } from '../logic/delete/updateUIAfterDelete.js'
const agregarEventoTabla = (tablaId, url, columnas) => {
  const tabla = document.querySelector(`#${tablaId}`)
  tabla.addEventListener('click', async (e) => {
    const target = e.target
    const tipoAccion = target.classList.contains('eliminar')
      ? 'eliminar'
      : target.classList.contains('editar')
      ? 'editar'
      : null
    if (tipoAccion) {
      const fila = target.closest('tr')
      const idProducto = fila.querySelector('td[data-id]').dataset.id
      if (tipoAccion === 'eliminar') {
        const deleted = await eliminarElemento(
          idProducto,
          url,
          `#${tablaId}`,
          columnas
        )
        deleteLine(idProducto, `#${tablaId}`, columnas, deleted)
      } else if (tipoAccion === 'editar') {
        await editarElemento(url, idProducto, tablaId, columnas)
      }
    }
  })
}
requestIdleCallback(() => {
  agregarEventoTabla('tableReservation', 'reservation', {
    id: 5,
    editables: [
      { nombre: 'name', indice: 0 },
      { nombre: 'table', indice: 1 },
      { nombre: 'telephon', indice: 2 },
      { nombre: 'reservationDate', indice: 3 },
      { nombre: 'reservationTime', indice: 4 }
    ]
  })
  agregarEventoTabla('tablaInventario', 'productos', {
    id: 6,
    editables: [
      { nombre: 'producto', indice: 0 },
      { nombre: 'cantidad', indice: 1 },
      { nombre: 'precio', indice: 2 },
      { nombre: 'maxAmount', indice: 3 },
      { nombre: 'categoria', indice: 4 },
      { nombre: 'proveedor', indice: 5 }
    ]
  })
  agregarEventoTabla('tablaEmpleados', 'users', {
    id: 4,
    editables: [
      { nombre: 'name', indice: 0 },
      { nombre: 'job', indice: 1 },
      { nombre: 'telephon', indice: 2 },
      { nombre: 'salary', indice: 3 }
    ]
  })
  agregarEventoTabla('tablaClientes', 'users', {
    id: 3,
    editables: [
      { nombre: 'name', indice: 0 },
      { nombre: 'email', indice: 1 },
      { nombre: 'telephon', indice: 2 }
    ]
  })
  agregarEventoTabla('tablaMerma', 'wasteControl', {
    id: 3,
    editables: [
      { nombre: 'wastageProduct', indice: 0 },
      { nombre: 'wastage', indice: 1 },
      { nombre: 'reason', indice: 2 }
    ]
  })
})
