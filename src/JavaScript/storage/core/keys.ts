export const DB_NAME = 'tpv-cache'
export const STORE = 'kv'
export const SEP = ':'
export const NAMESPACE = 'app'
export const VERSION = 'v1'
export const keyFor = (k: string) => `${NAMESPACE}${SEP}${VERSION}${SEP}${k}`
