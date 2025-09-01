const prepararEstructuraTabla = (tablaId, columnas, cantidad) => {
  const tablaBody = document.querySelector(`#${tablaId} tbody`)
  const fragmento = document.createDocumentFragment()
  tablaBody.innerHTML = ''
  for (let i = 0; i < cantidad; i++) {
    const fila = document.createElement('tr')
    columnas.forEach(() => {
      const celda = document.createElement('td')
      celda.textContent = 'Cargando...'
      fila.append(celda)
    })
    if (tablaId !== 'reportesFinancieros') {
      fila.append(document.createElement('td'))
      fila.append(document.createElement('td'))
    }
    fragmento.append(fila)
  }
  tablaBody.append(fragmento)
}
prepararEstructuraTabla(
  'tablaInventario',
  ['producto', 'cantidad', 'precio', 'maxAmount', 'categoria', 'proveedor'],
  20
)
prepararEstructuraTabla(
  'tableReservation',
  [
    'name',
    'table',
    'telephon',
    'reservationDate',
    'reservationTime',
    'allergies'
  ],
  20
)
prepararEstructuraTabla(
  'tablaMerma',
  ['wastageProduct', 'wastage', 'reason'],
  20
)
prepararEstructuraTabla(
  'gestionPersonal',
  ['name', 'job', 'telephon', 'salary'],
  20
)
prepararEstructuraTabla('clientes', ['name', 'email', 'telephon'], 20)
const getCellContent = (item, columna) => {
  switch (columna) {
    case 'reservationDate':
      const fecha = new Date(item[columna])
      return `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`
    case 'wastageProduct':
      return item.wastageProduct
        ? item.wastageProduct.producto
        : 'No disponible'
    case 'precio':
      return `${item[columna]}€`
    case 'name':
      return item.userId ? item.userId.name : item.name
    case 'telephon':
      return item.userId ? item.userId.telephon : item.telephon
    default:
      return item[columna] || undefined
  }
}
export const actualizarTabla = (tablaId, inventar, columnas) => {
  const filas = document.querySelectorAll(`#${tablaId} tbody tr`)
  const datos = inventar.filter(
    (item) =>
      (tablaId === 'clientes' && item.rol === 'Cliente') ||
      (tablaId === 'gestionPersonal' && item.job) ||
      (tablaId !== 'clientes' && tablaId !== 'gestionPersonal')
  )
  filas.forEach((fila, index) => {
    const celdas = fila.querySelectorAll('td')
    const item = datos[index]
    if (!item) return (fila.style.display = 'none')
    fila.style.display = ''
    columnas.forEach((columna, colIdx) => {
      celdas[colIdx].textContent = getCellContent(item, columna)
    })
    if (tablaId !== 'reportesFinancieros') {
      const idCelda = celdas[columnas.length]
      idCelda.dataset.id = item._id
      idCelda.style.display = 'none'
      idCelda.textContent = item._id
      const accionesCelda = celdas[columnas.length + 1]
      accionesCelda.innerHTML = ''
      const editarBtn = document.createElement('button')
      editarBtn.classList.add('editar')
      editarBtn.textContent = 'Editar'
      const eliminarBtn = document.createElement('button')
      eliminarBtn.classList.add('eliminar')
      eliminarBtn.textContent = 'Eliminar'
      accionesCelda.append(editarBtn, eliminarBtn)
    }
  })
}
