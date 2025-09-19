export const showToast = (message, type = 'info') => {
  const toast = document.createElement('div')
  toast.className = `toast ${type}`
  toast.textContent = message
  document.body.append(toast)
  setTimeout(() => {
    toast.classList.add('show')
  }, 10)
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
