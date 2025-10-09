export const appendOrderElementsToDom = (elements, pedidoItem) => {
  elements.forEach((element) => {
    const p = document.createElement('p')
    p.textContent = `${element.label} ${element.value}`
    pedidoItem.append(p)
  })
}
