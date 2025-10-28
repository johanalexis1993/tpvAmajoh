import { DB_NAME, STORE } from '../core/keys'
let _dbPromise: Promise<IDBDatabase | null> | undefined
export const openDB = () =>
  (_dbPromise ??= new Promise((res, rej) => {
    if (typeof indexedDB === 'undefined') return res(null)
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => res(req.result)
    req.onerror = () => rej(req.error)
  }))
export const withStore = async (
  mode: IDBTransactionMode,
  fn: (store: any, tx?: IDBTransaction) => void | Promise<void>
) => {
  const db = await openDB()
  if (!db) return fn(memoryStore)
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const store = tx.objectStore(STORE)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    Promise.resolve(fn(store, tx)).catch(reject)
  })
}
export const getFromStore = async (key: IDBValidKey) => {
  const db = await openDB()
  if (!db) return memoryStore.get(key)
  return await new Promise<any>((res, rej) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(key)
    req.onsuccess = () => res(req.result ?? null)
    req.onerror = () => rej(req.error)
  })
}
const memoryStore = (() => {
  const map = new Map()
  return {
    async get(key: any) {
      return map.get(key) ?? null
    },
    async put(val: any, key: any) {
      map.set(key, val)
    },
    async delete(key: any) {
      map.delete(key)
    },
    openCursor() {
      return { onsuccess: null as any, onerror: null as any }
    }
  }
})()
