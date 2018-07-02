export class PaginatedList<T> {
  readonly items: T[] = []
  readonly nextPageLink?: string
  readonly prevPageLink?: string
  readonly totalCount?: number
}
