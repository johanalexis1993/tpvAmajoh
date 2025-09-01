import {
  handleSearch,
  peticion,
  orders,
  getDishes,
  toDoLists,
  historialDeVentas
} from '../api/gets'
import { processPlatesData } from '../logic/get/processPlatesData.js'
import { actualizarTabla } from '../logic/get/updateTables.js'
import { handleInputEvent, delegarClicks } from '../helpers/delegarEvents.js'
requestIdleCallback(() => {
  handleSearch(
    '#plate',
    'plate/title/',
    'platos-lista',
    'plate/precio/',
    processPlatesData,
    [],
    () => getDishes('plate/', 'platos-lista', 'available')
  )
  handleSearch(
    '#searchReservation',
    'reservation/nameReservation/',
    'tableReservation',
    'reservation/telephonReservation/',
    actualizarTabla,
    [
      'name',
      'table',
      'telephon',
      'reservationDate',
      'reservationTime',
      'allergies'
    ],
    () =>
      peticion(
        'reservation/',
        'tableReservation',
        ['name', 'table', 'telephon', 'reservationDate', 'reservationTime'],
        1,
        20
      )
  )
  handleSearch(
    '#product',
    'productos/ProductByText/',
    'tablaInventario',
    'productos/ProductByPrice/',
    actualizarTabla,
    ['producto', 'cantidad', 'precio', 'maxAmount', 'categoria', 'proveedor'],
    () =>
      peticion(
        'productos/',
        'tablaInventario',
        [
          'producto',
          'cantidad',
          'precio',
          'maxAmount',
          'categoria',
          'proveedor'
        ],
        1,
        20
      )
  )
  const accionesClick = [
    [
      '#enlace-list',
      () =>
        toDoLists('productos/list/', [
          'Cantidad',
          'Precio',
          'Categoria',
          'Proveedor'
        ])
    ],
    [
      '#enlace-Losses',
      () =>
        peticion(
          'wasteControl/',
          'tablaMerma',
          ['wastageProduct', 'wastage', 'reason'],
          1,
          2
        )
    ],
    [
      '#enlace-gestionPersonal',
      () =>
        peticion(
          'users/',
          'gestionPersonal',
          ['name', 'job', 'telephon', 'salary'],
          1,
          2
        )
    ],
    [
      '#enlace-clientes',
      () => peticion('users/', 'clientes', ['name', 'email', 'telephon'], 1, 2)
    ],
    [
      '#enlace-reportesFinancieros',
      () =>
        peticion(
          'pedidos/salesBySource/',
          'reportesFinancieros',
          [
            'Dia',
            'Tarjeta',
            'Efectivo',
            'Maquinas Recreativas',
            'Glovo',
            'Tienda Online',
            'Total TPV'
          ],
          1,
          2
        )
    ],
    [
      '#enlace-reservation',
      () =>
        peticion(
          'reservation/',
          'tableReservation',
          [
            'name',
            'table',
            'telephon',
            'reservationDate',
            'reservationTime',
            'allergies'
          ],
          1,
          2
        )
    ],
    [
      '#enlace-caja',
      () => {
        orders('pedidos/')
        setInterval(() => orders('pedidos/'), 30000)
        getDishes('plate/')
      }
    ],
    [
      '#enlace-order',
      () => {
        getDishes('plate/')
        orders('pedidos/')
      }
    ],
    [
      '#enlace-estadisticasVentas',
      () => historialDeVentas('pedidos/salesHistory?period=day', 'day')
    ]
  ]
  delegarClicks(accionesClick),
    peticion(
      'productos/',
      'tablaInventario',
      ['producto', 'cantidad', 'precio', 'maxAmount', 'categoria', 'proveedor'],
      1,
      20
    )
  document.querySelector('#selectedPeriod').addEventListener('change', (e) => {
    const Period = e.target.value
    historialDeVentas(`pedidos/salesHistory?period=${Period}`, Period)
  })
  handleInputEvent('#emailContacto', 'users/email/', (user) => user.email)
  handleInputEvent(
    '#wastageProduct',
    'productos/ProductByText/',
    (producto) => producto.producto
  )
  handleInputEvent(
    '.divIngredient [type="text"]',
    'productos/ProductByText/',
    (producto) => producto.producto
  )
})
