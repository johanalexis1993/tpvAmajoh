import { deleteRequest, showError } from './requestHandler.js'
import { updateAmount } from '../logic/post/updateUIAfterPost.js'
export const eliminarElemento = async (id, url, tablaId) => {
  const confirmacion = confirm('¿Estás seguro de que lo quieres eliminar?')
  if (!confirmacion) return { ok: false }
  try {
    const res = await deleteRequest(url, id)
    if (tablaId === '#tablaMerma')
      updateAmount(res, 'tablaInventario', 'DELETE')
    return { ok: true }
  } catch (error) {
    showError(`Error al eliminar`, error)
    return { ok: false }
  }
}
