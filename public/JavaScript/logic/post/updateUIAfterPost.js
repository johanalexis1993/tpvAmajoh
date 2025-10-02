import { paintOrderItem } from '../put/paintOrderItem.js'
import { createPlateElement } from '../get/createPlateElement.js'
export const newLineInTable = (tableId, res, columns) => {
  const tabla = document.querySelector(`#${tableId}`)
  const nuevaFila = document.createElement('tr')
  columns.forEach((col) => {
    const nuevaCelda = document.createElement('td')
    let cellContent = res[col] || ''
    if (
      tableId === 'tablaClientes' &&
      ['name', 'email', 'telephon'].includes(col)
    ) {
      cellContent = res.userId ? res.userId[col] : ''
    } else if (
      tableId === 'tableReservation' &&
      ['name', 'telephon'].includes(col)
    ) {
      cellContent = res.userId ? res.userId[col] : ''
    } else if (col === 'reservationDate' && cellContent) {
      cellContent = new Date(cellContent)
        .toLocaleDateString('es-ES')
        .replace(/\//g, '-')
    } else if (tableId === 'tablaInventario' && col === 'precio') {
      cellContent = `${cellContent}€`
    } else if (col === 'wastageProduct' && res[col]) {
      cellContent = res[col].producto || ''
    }
    nuevaCelda.innerHTML = cellContent
    nuevaFila.append(nuevaCelda)
  })
  const celdaId = document.createElement('td')
  celdaId.setAttribute('data-id', res._id)
  celdaId.style.display = 'none'
  celdaId.innerHTML = res._id
  nuevaFila.append(celdaId)
  const celdaAcciones = document.createElement('td')
  celdaAcciones.innerHTML =
    '<button class="editar">Editar</button><button class="eliminar">Eliminar</button>'
  nuevaFila.append(celdaAcciones)
  tabla.querySelector('tbody').append(nuevaFila)
}
export const paintOrderInDom = (pedido) => {
  const pedidosDiv = document.querySelector('#pedidos ul')
  const pedidoItem = paintOrderItem(pedido)
  pedidosDiv.append(pedidoItem)
}
export const addPlateToDOM = (plate) => {
  const listPlates = document.querySelector('#platos-lista')
  let categoryHeader = Array.from(listPlates.querySelectorAll('h2')).find(
    (h2) => h2.textContent === plate.category
  )
  let ulPlates
  if (!categoryHeader) {
    const h2 = document.createElement('h2')
    h2.textContent = plate.category
    listPlates.append(h2)
    ulPlates = document.createElement('ul')
    listPlates.append(ulPlates)
  } else {
    ulPlates = categoryHeader.nextElementSibling
    if (!ulPlates || ulPlates.tagName !== 'UL') {
      ulPlates = document.createElement('ul')
      categoryHeader.insertAdjacentElement('afterend', ulPlates)
    }
  }
  const liPlate = createPlateElement(plate)
  ulPlates.append(liPlate)
}
export const updateAmount = (res, tablaId, method) => {
  const {
    originalWastaId,
    updatedWastage: {
      wastageProduct: { _id: productId, producto: updatedWastage } = {},
      wastage: cantidadMerma
    } = {},
    originalWastageName,
    originalWastageAmount,
    wastageProduct: { _id: productIdFallback } = {},
    wastage: cantidadMermaFallback
  } = res
  const idProducto = productId || productIdFallback
  const cantidadProducto = cantidadMerma || cantidadMermaFallback
  const filas = Array.from(document.querySelector(`#${tablaId} tbody`).rows)
  filas.forEach((fila) => {
    const idCelda = fila.querySelector('[data-id]')
    const cantidadCelda = fila.cells[1]
    if (!idCelda) return
    const cellId = idCelda.dataset.id
    const cantidadActual = parseInt(cantidadCelda.textContent)
    if (method === 'PUT' && updatedWastage !== originalWastageName) {
      if (cellId === originalWastaId) {
        cantidadCelda.textContent = cantidadActual + originalWastageAmount
      } else if (cellId === idProducto) {
        cantidadCelda.textContent = cantidadActual - cantidadProducto
      }
    } else if (cellId === idProducto) {
      let nuevaCantidad
      switch (method) {
        case 'DELETE':
          nuevaCantidad = cantidadActual + cantidadProducto
          break
        case 'POST':
          nuevaCantidad = cantidadActual - cantidadProducto
          break
        case 'PUT':
          nuevaCantidad =
            cantidadActual + (originalWastageAmount - cantidadProducto)
          break
        default:
          console.error(`Método no soportado: ${method}`)
          return
      }
      cantidadCelda.textContent = nuevaCantidad
    }
  })
}
const extractIngredientsFromProducts = (products) => {
  return products.reduce((acc, product) => {
    if (product.ingredients && Array.isArray(product.ingredients))
      return acc.concat(product.ingredients)
    return acc
  }, [])
}
export const updateTableAmount = (tableId, items) => {
  const ingredients =
    items.length > 0 && items[0].ingredients
      ? extractIngredientsFromProducts(items)
      : items
  const table = document.getElementById(tableId)
  if (!table) return
  const byName = new Map(
    ingredients.map((ing) => [ing.name, Number.parseInt(ing.amount, 10) || 0])
  )
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i]
    const name = row.cells[0].textContent.trim()
    const delta = byName.get(name)
    if (delta == null) continue
    const cell = row.cells[1]
    const current = Number.parseInt(cell.textContent, 10) || 0
    cell.textContent = String(current - delta)
  }
}
