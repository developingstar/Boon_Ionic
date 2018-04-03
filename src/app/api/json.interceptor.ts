import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class JsonInterceptor implements HttpInterceptor {
  public intercept(
    initialRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const additionalHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    const request = initialRequest.clone({
      headers: additionalHeaders,
      ...initialRequest.headers
    })

    return next.handle(request)
  }
}
