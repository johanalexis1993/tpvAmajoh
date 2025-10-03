const runWithTimeout = async (fnOrPromise, timeoutMs, isFn) => {
  const start = performance.now()
  let to
  if (!timeoutMs) {
    try {
      const data = await (isFn ? fnOrPromise() : fnOrPromise)
      return { ok: true, data, elapsedMs: performance.now() - start }
    } catch (e) {
      return { ok: false, err: e, elapsedMs: performance.now() - start }
    }
  }
  try {
    if (isFn) {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort('Timeout'), timeoutMs)
      try {
        const data = await fnOrPromise(ctrl.signal)
        return { ok: true, data, elapsedMs: performance.now() - start }
      } finally {
        clearTimeout(t)
      }
    } else {
      const data = await Promise.race([
        fnOrPromise,
        new Promise((_, rej) => {
          to = setTimeout(() => {
            const err = new Error('Timeout')
            err.name = 'AbortError'
            rej(err)
          }, timeoutMs)
        })
      ])
      return { ok: true, data, elapsedMs: performance.now() - start }
    }
  } catch (e) {
    return { ok: false, err: e, elapsedMs: performance.now() - start }
  } finally {
    clearTimeout(to)
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const defaultShouldRetry = (e, noRetryOnAbort) => {
  const status = e?.status ?? e?.cause?.status
  const code = e?.code
  const isAbort = e?.name === 'AbortError' || code === 'ABORT'
  if (noRetryOnAbort && isAbort) return false
  if (code === 'NETWORK') return true
  if (typeof status === 'number' && status >= 500) return true
  return false
}
export const handle = async (fnOrPromise, opts = {}) => {
  const {
    mode = 'notify',
    onError,
    timeoutMs,
    retries = 0,
    shouldRetry,
    backoffBase = 300,
    backoffFactor = 2,
    noRetryOnAbort = true,
    mapError,
    cleanup,
    label
  } = opts
  const isFn = typeof fnOrPromise === 'function'
  let attempt = 0
  let result, err, elapsedMs
  try {
    while (true) {
      const r = await runWithTimeout(fnOrPromise, timeoutMs, isFn)
      elapsedMs = r.elapsedMs
      if (r.ok) {
        result = r.data
        break
      }
      err = r.err
      if (mapError) {
        try {
          err = mapError(err) || err
        } catch {}
      }
      const canRetry =
        attempt < retries &&
        (shouldRetry
          ? shouldRetry(err)
          : defaultShouldRetry(err, noRetryOnAbort))
      if (!canRetry) break
      const wait = backoffBase * backoffFactor ** attempt
      await sleep(wait)
      attempt += 1
    }
  } finally {
    try {
      await cleanup?.()
    } catch (ce) {
      console.warn('[handle:cleanup-failed]', ce)
    }
  }
  if (err) {
    if (mode !== 'silent') {
      try {
        onError?.(err, { label, attempt, elapsedMs: elapsedMs ?? 0 })
      } catch {}
    }
    if (mode === 'strict') throw err
    return null
  }
  return result
}
