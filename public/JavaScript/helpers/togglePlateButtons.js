export const togglePlateButtons = (shouldHide) => {
  const agregarBtns = document.querySelectorAll('.agregar-btn')
  const eliminarBtns = document.querySelectorAll('.eliminar-btn')
  const displayValue = shouldHide ? 'none' : 'inline-block'
  agregarBtns.forEach((btn) => (btn.style.display = displayValue))
  eliminarBtns.forEach((btn) => (btn.style.display = displayValue))
}
