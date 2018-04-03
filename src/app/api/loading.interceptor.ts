import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { environment } from '@environment/environment'
import { LoaderService } from './loader.service'

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private readonly loader: LoaderService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.startsWith(environment.apiBaseUrl)) {
      this.loader.incrementPendingRequests()

      return next
        .handle(request)
        .finally(() => this.loader.decrementPendingRequests())
    } else {
      return next.handle(request)
    }
  }
}
