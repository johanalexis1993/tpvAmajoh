requestIdleCallback(() => {
  const form = document.querySelector('form[data-submit="plateMenu"]')
  const fileInput = form?.querySelector('input[type="file"]')
  if (!fileInput) return
  const el = (tag, className) =>
    Object.assign(document.createElement(tag), { className })
  const progress = el('progress', 'hidden')
  const status = el('small', 'upload-status hidden')
  progress.max = 100
  fileInput.parentElement.append(progress, status)
  fileInput.addEventListener('change', () => {
    if (!fileInput.files.length) return
    let value = 0
    progress.value = 0
    status.textContent = 'Cargando...'
    progress.classList.remove('hidden')
    status.classList.remove('hidden')
    const interval = setInterval(() => {
      progress.value = value += 5
      status.textContent = `Cargando... ${value}%`
      if (value >= 100) {
        clearInterval(interval)
        status.textContent = 'Carga completada ✔'
        setTimeout(() => {
          progress.classList.add('hidden')
          status.classList.add('hidden')
        }, 1500)
      }
    }, 50)
  })
})
