import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { AuthService } from '../auth/auth.service'
import { showToast } from '../utils/toast'
import { ApiError } from './error.model'

@Injectable()
export class GenericErrorsInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly toast: ToastController
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .do(
        (event: HttpEvent<any>) => event,
        (error: HttpErrorResponse) => this.handleErrorResponse(error)
      )
  }

  private handleErrorResponse(error: HttpErrorResponse): HttpErrorResponse {
    if (error.status === 401) {
      this.authService.logout()
    }

    /* HTTP 422 response means validation errors on the API side. Do not show
     * toast boxes in such case because they need to be handled manaually
     * (like displaying error message next to the input).
     */
    if (error.status !== 422) {
      this.extractErrorDetails(error).forEach((message) => {
        showToast(this.toast, message, 2000, false)
      })
    }

    return error
  }

  private extractErrorDetails(
    response: HttpErrorResponse
  ): ReadonlyArray<string> {
    // `errors` array won't be available if the error doesn't come from the API.
    if (response.error.errors instanceof Array) {
      return response.error.errors.map((error: ApiError) => error.detail)
    } else {
      return [response.statusText]
    }
  }
}
