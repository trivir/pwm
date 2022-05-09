export interface PwmRestResult<T> {
  data?: T
  error: boolean
  errorCode: number
  errorMessage?: string
  errorDetail?: string
  successMessage?: string
}
