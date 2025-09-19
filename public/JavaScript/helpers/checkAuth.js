requestIdleCallback(() => {
  const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 0))
  const isAuthPage = () => {
    const p = location.pathname
    return (
      p === '/' ||
      p.endsWith('/index.html') ||
      p.includes('/login') ||
      p.includes('/register')
    )
  }
  const checkAuth = async () => {
    if (isAuthPage()) return
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      })
      if (!res.ok) {
        location.replace('/index.html')
        return
      }
    } catch {
      location.replace('/index.html')
    }
  }
  idle(checkAuth, { timeout: 1000 })
})
