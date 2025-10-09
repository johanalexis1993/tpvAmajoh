export const deleteLine = (id, tablaId, columnas, deleted) => {
  if (deleted.ok) {
    const tabla = document.querySelector(tablaId)
    const filas = tabla.querySelectorAll('tbody tr')
    for (const fila of filas) {
      const celdas = fila.querySelectorAll('td')
      if (celdas[columnas.id].getAttribute('data-id') === id) {
        fila.remove()
        break
      }
    }
  } else {
    return
  }
}
export const removePlateFromDOM = (plateId, category, deleted) => {
  if (deleted.ok) {
    const liPlate = document.querySelector(`li[data-id="${plateId}"]`)
    if (liPlate) {
      const ulPlatos = liPlate.parentElement
      liPlate.remove()
      if (!ulPlatos.querySelector('li')) {
        const h2 = ulPlatos.previousElementSibling
        if (h2 && h2.tagName === 'H2' && h2.textContent === category)
          h2.remove()
        ulPlatos.remove()
      }
    }
  } else {
    return
  }
}
