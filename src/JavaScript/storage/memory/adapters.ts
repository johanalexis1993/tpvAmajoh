import { createMemoryStore, KVStore } from './store'
export type Backend = 'idb' | 'memory'
export const detectBackend = (): Backend =>
  typeof indexedDB === 'undefined' ? 'memory' : 'idb'
export const getMemoryKVStore = (): KVStore => createMemoryStore()
