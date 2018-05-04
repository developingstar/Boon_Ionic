import { HttpParams } from '@angular/common/http'

export interface IHttpRequestOptions {
  readonly url: string | null
  readonly params: HttpParams
}

export const blankHttpRequestOptions: IHttpRequestOptions = {
  params: new HttpParams(),
  url: null
}
