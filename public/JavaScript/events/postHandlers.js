import { postPetition, postMenu, postRegister, postLogin } from '../api/post.js'
import {
  newLineInTable,
  updateAmount,
  updateTableAmount
} from '../logic/post/updateUIAfterPost.js'
document.addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target
  const action = form.dataset.submit
  const formMapping = {
    productSubmit: async () => {
      const res = await postPetition(form, 'productos')
      newLineInTable('tablaInventario', res, [
        'producto',
        'cantidad',
        'precio',
        'maxAmount',
        'categoria',
        'proveedor'
      ])
      updateTableAmount('tablaInventario', res.ingredients)
    },
    wastageSubmit: async () => {
      const res = await postPetition(form, 'wasteControl')
      newLineInTable('tablaMerma', res, ['wastageProduct', 'wastage', 'reason'])
      updateAmount(res, 'tablaInventario', 'POST')
    },
    employeeSubmit: async () => {
      const res = await postPetition(form, `users/register`)
      newLineInTable('tablaEmpleados', res, [
        'name',
        'job',
        'telephon',
        'salary'
      ])
    },
    reservations: async () => {
      const res = await postPetition(form, `reservation`)
      newLineInTable('tableReservation', res, [
        'name',
        'table',
        'telephon',
        'reservationDate',
        'reservationTime'
      ])
      newLineInTable('tablaClientes', res, ['name', 'email', 'telephon'])
    },
    plateMenu: () => postMenu(form),
    register: () => postRegister(form),
    login: () => postLogin(form)
  }
  if (formMapping[action]) await formMapping[action]()
})
