export type TTL = number | null
export interface Payload<T = any> {
  v: string
  t: number
  ttl: TTL
  data: T
}
export interface StorageAPI {
  get<T = any>(key: string, fallback?: T | null): Promise<T | null>
  getRaw<T = any>(key: string): Promise<Payload<T> | null>
  set<T = any>(key: string, value: T, opts?: { ttl?: TTL }): Promise<T>
  update<T = any>(
    key: string,
    updater: ((curr: T | undefined) => T) | T,
    opts?: { ttl?: TTL }
  ): Promise<T>
  batchSet(obj: Record<string, any>, opts?: { ttl?: TTL }): Promise<void>
  del(key: string): Promise<void>
  has(key: string): Promise<boolean>
  clearNamespace(): Promise<void>
  clearVersion(): Promise<void>
  sub<T = any>(key: string, fn: (value: T | undefined) => void): () => void
}
export interface UpdateEventDetail<T = any> {
  key: string
  value: T | undefined
}
