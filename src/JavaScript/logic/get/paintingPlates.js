import { createPlateElement } from './createPlateElement.js'
export const createOrUpdateCategoryContainer = (container, category) => {
  let h2 = Array.from(container.querySelectorAll('h2')).find(
    (h) => h.textContent === category
  )
  let ul
  if (!h2) {
    h2 = document.createElement('h2')
    h2.textContent = category
    ul = document.createElement('ul')
    container.append(h2, ul)
  } else {
    ul = h2.nextElementSibling
  }
  return ul
}
export const paintingPlates = (platosPorCategoria, id) => {
  const listaPlatos = document.querySelector(`#${id}`)
  listaPlatos.innerHTML = ''
  const fragmento = document.createDocumentFragment()
  Object.entries(platosPorCategoria).forEach(([categoria, platos]) => {
    const ulPlatos = createOrUpdateCategoryContainer(fragmento, categoria)
    platos.forEach((plato) => {
      const liPlato = createPlateElement(plato)
      ulPlatos.append(liPlato)
    })
  })
  listaPlatos.append(fragmento)
}
