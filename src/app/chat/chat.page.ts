import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular'
import { NavService } from '../nav/nav.service'
import { ChatService } from './chat.service'
import { MessageThread } from './message-thread.model'

@IonicPage({
  segment: 'chat'
})
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.page.html'
})
export class ChatPage {
  @ViewChild('messagesIndex') messageIndexComponent: any
  loading: boolean
  messageThreadShow: boolean = true
  threadOpen: MessageThread
  noThreads: boolean
  isMobile: boolean
  showIndex: boolean

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public navService: NavService,
    public chatService: ChatService,
    public platform: Platform
  ) {
    this.isMobile = this.platform.is('mobile')
  }

  openThread(thread: any): void {
    this.threadOpen = thread
    // this.showIndex = true
    // if (this.isMobile) {
    //   this.showIndex = false
    // }
  }

  openThreads(): void {
    this.messageThreadShow = true
  }

  openOrCreateMessaging(e: any): void {
    this.messageIndexComponent.openOrCreate(e.thread)
  }
}
