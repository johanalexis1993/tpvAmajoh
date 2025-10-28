import { VERSION } from './keys'
export const wrapValue = (data: any, ttl: number | null = null) => ({
  v: VERSION,
  t: Date.now(),
  ttl,
  data
})
export const isExpired = (p?: { t: number; ttl: number | null }) =>
  !p?.ttl ? false : Date.now() - p.t > p.ttl
