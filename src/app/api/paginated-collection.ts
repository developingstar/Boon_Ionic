export class PaginatedCollection<T> {
  readonly count: number | null
  readonly items: ReadonlyArray<T> = []
  readonly nextPageLink: string | null = null
  readonly prevPageLink: string | null = null
}
