import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ToastController } from 'ionic-angular'

import { AuthInterceptor } from './api/auth.interceptor'
import { GenericErrorsInterceptor } from './api/generic-errors.interceptor'
import { JsonInterceptor } from './api/json.interceptor'
import { LoaderService } from './api/loader.service'
import { LoadingInterceptor } from './api/loading.interceptor'
import { UrlInterceptor } from './api/url.interceptor'

@NgModule({
  bootstrap: [],
  declarations: [],
  entryComponents: [],
  imports: [],
  providers: [
    LoaderService,
    // `UrlInterceptor` has to be before `LoadingInterceptor` because the later
    // one depends on the full URL.
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: UrlInterceptor
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: GenericErrorsInterceptor
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: JsonInterceptor
    },
    ToastController
  ]
})
export class ApiModule {}
