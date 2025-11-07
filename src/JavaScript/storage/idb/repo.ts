import { NAMESPACE, VERSION, SEP, STORE, keyFor } from '../core/keys'
import { wrapValue, isExpired } from '../core/ttl'
import { emitUpdate } from '../core/events'
import { storageHandle } from '../core/handle'
import { withStore, getFromStore, openDB } from './openDB'
export const get = async (key: string, fallback: any = null) => {
  const p = await getFromStore(keyFor(key))
  return !p || isExpired(p) ? fallback : p.data
}
export const getRaw = async (key: string) => getFromStore(keyFor(key))
export const has = async (key: string) => {
  const p = await getFromStore(keyFor(key))
  return !!(p && !isExpired(p))
}
export const set = async (key: string, value: any, { ttl = null } = {}) => {
  const k = keyFor(key)
  const payload = wrapValue(value, ttl)
  await storageHandle(() =>
    withStore('readwrite', (store: any) => store.put(payload, k))
  )
  emitUpdate(key, value)
  return value
}
export const update = async (
  key: string,
  updater: any,
  { ttl = null } = {}
) => {
  const current = await get(key, undefined)
  const next = typeof updater === 'function' ? updater(current) : updater
  return set(key, next, { ttl })
}
export const batchSet = async (
  obj: Record<string, any>,
  { ttl = null } = {}
) => {
  const entries = Object.entries(obj)
  if (!entries.length) return
  const now = Date.now()
  await storageHandle(() =>
    withStore('readwrite', (store: any) => {
      for (const [k, v] of entries)
        store.put({ v: 'v1', t: now, ttl, data: v }, keyFor(k))
    })
  )
  for (const [k, v] of entries) emitUpdate(k, v)
}
export const del = async (key: string) => {
  const k = keyFor(key)
  await storageHandle(() =>
    withStore('readwrite', (store: any) => store.delete(k))
  )
  emitUpdate(key, undefined)
}
export const clearNamespace = async (): Promise<void> => {
  const prefix = `${NAMESPACE}${SEP}`
  const db = await openDB()
  if (!db) return
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.openCursor()
    req.onsuccess = () => {
      const cur = (req as IDBRequest<IDBCursorWithValue | null>).result
      if (!cur) return
      if (String(cur.key).startsWith(prefix)) cur.delete()
      cur.continue()
    }
    req.onerror = () => reject(req.error as any)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error as any)
  })
}
export const clearVersion = async (): Promise<void> => {
  const prefix = `${NAMESPACE}${SEP}${VERSION}${SEP}`
  const db = await openDB()
  if (!db) return
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.openCursor()
    req.onsuccess = () => {
      const cur = (req as IDBRequest<IDBCursorWithValue | null>).result
      if (!cur) return
      if (String(cur.key).startsWith(prefix)) cur.delete()
      cur.continue()
    }
    req.onerror = () => reject(req.error as any)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error as any)
  })
}
