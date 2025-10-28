export interface KVStore {
  get(key: IDBValidKey): Promise<any | null>
  put(value: any, key: IDBValidKey): Promise<void>
  delete(key: IDBValidKey): Promise<void>
  iterate?(cb: (key: IDBValidKey, value: any) => void): Promise<void>
  clear?(cb?: () => void): Promise<void>
}
export const createMemoryStore = (): KVStore => {
  const map = new Map<IDBValidKey, any>()
  return {
    async get(key) {
      return map.get(key) ?? null
    },
    async put(value, key) {
      map.set(key, value)
    },
    async delete(key) {
      map.delete(key)
    },
    async iterate(cb) {
      for (const [k, v] of map.entries()) cb(k, v)
    },
    async clear(cb) {
      map.clear()
      cb && cb()
    }
  }
}
