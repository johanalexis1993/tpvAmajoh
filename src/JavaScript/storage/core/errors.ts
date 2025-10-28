export enum StorageErrorCode {
  QUOTA_EXCEEDED = 'IDB_QUOTA_EXCEEDED',
  TX_ABORT = 'IDB_TX_ABORT',
  NOT_SUPPORTED = 'IDB_NOT_SUPPORTED'
}
export class StorageError extends Error {
  code: StorageErrorCode
  constructor(code: StorageErrorCode, cause?: unknown) {
    super(code)
    this.code = code
    ;(this as any).cause = cause
  }
}
