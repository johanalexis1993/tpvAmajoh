export const renderList = (
  res,
  containerId,
  title = [],
  text,
  batchSize = 20
) => {
  const container = document.querySelector(`#${containerId}`)
  if (!container) return
  container.innerHTML = ''
  const fragment = document.createDocumentFragment()
  if (title.length) {
    const titleElement = document.createElement('h2')
    titleElement.textContent = title
    fragment.append(titleElement)
  }
  let renderedCount = 0
  const renderBatch = () => {
    const end = Math.min(renderedCount + batchSize, res.length)
    for (let i = renderedCount; i < end; i++) {
      const item = res[i]
      const detailsElement = document.createElement('details')
      const summary = document.createElement('summary')
      const iconSpan = document.createElement('span')
      iconSpan.className = 'icon'
      iconSpan.textContent =
        item.tipo === 'pedido'
          ? '🛒'
          : item.tipo === 'notificacion'
          ? '🔔'
          : item.tipo === 'cocinero'
          ? '👨‍🍳'
          : item.cantidad === 0
          ? '❌'
          : '🔔'
      iconSpan.style.fontFamily =
        '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
      const labelSpan = document.createElement('span')
      labelSpan.className = 'label'
      labelSpan.textContent = item.producto || item.userId?.name || 'Item'
      summary.append(iconSpan, ' ', labelSpan)
      if (item.cantidad === 0) summary.style.backgroundColor = 'var(--red)'
      detailsElement.dataset.id = item._id
      detailsElement.append(summary)
      text.forEach((key) => {
        const p = document.createElement('p')
        let value = item[key.toLowerCase()] || item[key]
        if (key.toLowerCase() === 'reservationdate')
          value = new Date(value).toLocaleDateString()
        p.innerHTML = `<strong>${key}:</strong> ${value ?? '0'}`
        detailsElement.append(p)
      })
      fragment.append(detailsElement)
    }
    container.append(fragment)
    renderedCount = end
  }
  renderBatch()
  container.addEventListener('scroll', function onScroll() {
    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight
    ) {
      renderedCount < res.length
        ? renderBatch()
        : container.removeEventListener('scroll', onScroll)
    }
  })
}
