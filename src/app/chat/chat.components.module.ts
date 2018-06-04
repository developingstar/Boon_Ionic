import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
// import { Keyboard } from '@ionic-native/keyboard'
import { IonicModule } from 'ionic-angular'
import { InlineSVGModule } from 'ng-inline-svg'
import { ChatIndexHeaderComponent } from './chat-index/chat-index-header/chat-index-header.component'
import { ChatIndexListComponent } from './chat-index/chat-index-list/chat-index-list.component'
import { ChatIndexComponent } from './chat-index/chat-index.component'
import { ChatShowComponent } from './chat-show/chat-show.component'
import { WebSocketsService } from './websockets.service'

@NgModule({
  declarations: [
    ChatIndexComponent,
    ChatIndexListComponent,
    ChatIndexHeaderComponent,
    ChatShowComponent
  ],
  exports: [
    ChatIndexComponent,
    ChatIndexListComponent,
    ChatIndexHeaderComponent,
    ChatShowComponent
  ],
  imports: [
    IonicModule,
    HttpClientModule,
    InlineSVGModule.forRoot({ baseUrl: 'assets/' })
  ],
  providers: [WebSocketsService /*, Keyboard*/]
})
export class ChatComponentsModule {}
