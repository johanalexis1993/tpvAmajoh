export const showToast = (message, type = 'info') => {
  const toast = document.createElement('div')
  toast.className = `toast ${type}`
  const isError = type === 'error' || type === 'danger'
  toast.setAttribute('role', isError ? 'alert' : 'status')
  toast.setAttribute('aria-live', isError ? 'assertive' : 'polite')
  toast.setAttribute('aria-atomic', 'true')
  document.body.append(toast)
  requestAnimationFrame(() => {
    toast.textContent = message
  })
  setTimeout(() => {
    toast.classList.add('show')
  }, 10)
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
