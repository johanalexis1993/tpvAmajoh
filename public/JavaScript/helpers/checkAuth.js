requestIdleCallback(() => {
  const token = localStorage.getItem('token')
  if (
    !token ||
    token.trim() === '' ||
    token === 'undefined' ||
    token === 'null'
  ) {
    window.location.replace('/index.html')
  }
})
