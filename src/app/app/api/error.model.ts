export class ApiError {
  readonly detail: string
  readonly title?: string
  readonly source?: {
    readonly pointer: string
  }
}
