import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { environment } from '@environment/environment'

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  public intercept(
    initialRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = new URL(initialRequest.url, environment.apiBaseUrl).toString()
    const request = initialRequest.clone({ url: url })

    return next.handle(request)
  }
}
