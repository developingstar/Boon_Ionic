import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { NavModule } from '../nav.module'
import { AlertService } from '../settings/alert.service'
import { ChatComponentsModule } from './chat.components.module'
import { ChatPage } from './chat.page'
import { CurrentConversationService } from './current-conversation.service'

@NgModule({
  declarations: [ChatPage],
  entryComponents: [ChatPage],
  imports: [
    IonicPageModule.forChild(ChatPage),
    NavModule,
    ChatComponentsModule
  ],
  providers: [CurrentConversationService, AlertService]
})
export class ChatPageModule {}
