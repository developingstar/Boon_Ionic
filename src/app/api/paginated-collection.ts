export class PaginatedCollection<T> {
  readonly items: ReadonlyArray<T> = []
  readonly nextPageLink: string | null = null
  readonly prevPageLink: string | null = null
}
