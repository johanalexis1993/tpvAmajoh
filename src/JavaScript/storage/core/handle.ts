import { StorageError, StorageErrorCode } from './errors'
type Options = { strict?: boolean }
export async function storageHandle<T>(
  op: () => Promise<T>,
  _opts: Options = {}
) {
  try {
    return await op()
  } catch (err: any) {
    const name = String(err?.name || err)
    if (name.includes('Quota'))
      throw new StorageError(StorageErrorCode.QUOTA_EXCEEDED, err)
    if (name.includes('AbortError'))
      throw new StorageError(StorageErrorCode.TX_ABORT, err)
    if (name.includes('NotSupported'))
      throw new StorageError(StorageErrorCode.NOT_SUPPORTED, err)
    throw err
  }
}
