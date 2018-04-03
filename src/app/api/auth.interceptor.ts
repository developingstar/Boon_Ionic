import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public intercept(
    initialRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const request = initialRequest.clone({
      setHeaders: { Credentials: 'same-origin' },
      ...initialRequest.headers,
      withCredentials: true
    })

    return next.handle(request)
  }
}
