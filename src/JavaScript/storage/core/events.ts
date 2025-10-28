export const emitUpdate = (key: string, value: any) => {
  try {
    window.dispatchEvent(
      new CustomEvent('ls:update', { detail: { key, value } })
    )
  } catch {}
}
//PWA hay contextos que pueden escribir en IndexedDB sin que tu vista lo sepa y sub pasa aser util
export const sub = (key: string, fn: (v: any) => void) => {
  const handler = (ev: any) => ev.detail?.key === key && fn(ev.detail.value)
  try {
    window.addEventListener('ls:update', handler)
  } catch {}
  return () => {
    try {
      window.removeEventListener('ls:update', handler)
    } catch {}
  }
}
