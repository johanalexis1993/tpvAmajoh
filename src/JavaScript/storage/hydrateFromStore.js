const DB_NAME = 'tpv-cache'
const DB_VERSION = 1
const STORE_NAME = 'kv'
const NAMESPACE = 'tpv'
const VERSION = 1
const SEP = '::'
const keyFor = (k) => `${NAMESPACE}${SEP}${VERSION}${SEP}${k}`
const openDB = () =>
  new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME))
        db.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => res(req.result)
    req.onerror = () => rej(req.error)
  })
const idbPut = async (key, value) => {
  const db = await openDB()
  await new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(value, key)
    tx.oncomplete = res
    tx.onerror = () => rej(tx.error)
  })
  db.close()
}
const idbGet = async (key) => {
  const db = await openDB()
  const out = await new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => res(req.result)
    req.onerror = () => rej(req.error)
  })
  db.close()
  return out
}
const set = async (k, value, ttlMs = null) => {
  const payload = { v: VERSION, t: Date.now(), ttl: ttlMs, data: value }
  await idbPut(keyFor(k), payload)
  window.dispatchEvent(
    new CustomEvent('ls:update', { detail: { key: k, value } })
  )
}
const get = async (k, fallback) => {
  const payload = await idbGet(keyFor(k))
  if (!payload) return fallback
  if (payload.ttl && Date.now() - payload.t > payload.ttl) return fallback
  return payload.data ?? fallback
}
const update = async (k, updater, fallback) => {
  const current = await get(k, fallback)
  const next = updater(current)
  await set(k, next)
  return next
}
const batchSet = async (obj) => {
  for (const [k, v] of Object.entries(obj)) await set(k, v)
}
const sub = (k, fn) => {
  const handler = (e) => {
    if (e.detail?.key === k) fn(e.detail.value)
  }
  window.addEventListener('ls:update', handler)
  return () => window.removeEventListener('ls:update', handler)
}
export const LS = { get, set, update, batchSet, sub }
