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
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const runOnce = async () => {
    const start = performance.now()
    if (timeoutMs && isFn) {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort('Timeout'), timeoutMs)
      try {
        const data = await fnOrPromise(ctrl.signal)
        return { ok: true, data, elapsedMs: performance.now() - start }
      } catch (e) {
        return { ok: false, err: e, elapsedMs: performance.now() - start }
      } finally {
        clearTimeout(t)
      }
    }
    if (timeoutMs && !isFn) {
      let to
      try {
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
      } catch (e) {
        return { ok: false, err: e, elapsedMs: performance.now() - start }
      } finally {
        clearTimeout(to)
      }
    }
    try {
      const data = await (isFn ? fnOrPromise() : fnOrPromise)
      return { ok: true, data, elapsedMs: performance.now() - start }
    } catch (e) {
      return { ok: false, err: e, elapsedMs: performance.now() - start }
    }
  }
  const defaultShouldRetry = (e) => {
    const status = e?.status ?? e?.cause?.status
    const code = e?.code
    const isAbort = e?.name === 'AbortError' || code === 'ABORT'
    if (noRetryOnAbort && isAbort) return false
    if (code === 'NETWORK') return true
    if (typeof status === 'number' && status >= 500) return true
    return false
  }
  let attempt = 0
  let result, err, elapsedMs
  try {
    while (true) {
      const r = await runOnce()
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
        (shouldRetry ? shouldRetry(err) : defaultShouldRetry(err))
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
