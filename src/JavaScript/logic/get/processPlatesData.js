import { paintingPlates } from './paintingPlates.js'
export const processPlatesData = (id, data) => {
  const platosPorCategoria = {}
  data.forEach((plato) => {
    const { category } = plato
    if (!platosPorCategoria[category]) platosPorCategoria[category] = []
    platosPorCategoria[category].push(plato)
  })
  paintingPlates(platosPorCategoria, id)
}
