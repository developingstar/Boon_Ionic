import { HttpClientModule } from '@angular/common/http'
import { ErrorHandler, NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'

import { ApiModule } from './api.module'
import { AppComponent } from './app/app.component'
import { AuthModule } from './auth.module'
import { CrmModule } from './crm.module'
import { JourneysModule } from './journeys.module'
import { MessagesModule } from './messages.module'
import { NavModule } from './nav.module'
import { NavService } from './nav/nav.service'
import { TemplatesModule } from './templates.module'

@NgModule({
  bootstrap: [IonicApp],
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  imports: [
    ApiModule,
    AuthModule,
    BrowserModule,
    CrmModule,
    HttpClientModule,
    JourneysModule,
    MessagesModule,
    IonicModule.forRoot(AppComponent, {
      popoverEnter: 'popover-pop-in',
      popoverLeave: 'popover-pop-out'
    }),
    NavModule,
    TemplatesModule,
    ReactiveFormsModule
  ],
  providers: [
    NavService,
    SplashScreen,
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
