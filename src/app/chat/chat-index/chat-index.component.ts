import { Component } from '@angular/core'
import {
  Events,
  LoadingController,
  NavController,
  Platform
} from 'ionic-angular'
// import * as moment from 'moment'
import { ChatService } from '../chat.service'
import { CurrentConversationService } from '../current-conversation.service'
import { MessageThread } from '../message-thread.model'
import { WebSocketsService } from '../websockets.service'

@Component({
  selector: 'chat-index',
  templateUrl: 'chat-index.component.html'
})
export class ChatIndexComponent {
  public threads: MessageThread[]
  public selectedIndex: number = 0
  public isMobile: boolean
  public filtering: boolean = false
  public filter: string = 'All Messages'
  public searching: boolean = false

  constructor(
    private chatService: ChatService,
    private currentConversationService: CurrentConversationService,
    public navCtrl: NavController,
    public events: Events,
    private webSockets: WebSocketsService,
    public loadingCtrl: LoadingController,
    public platform: Platform
  ) {
    this.getConversations('active')
  }

  ngOnInit(): void {
    this.isMobile = this.platform.is('mobile')
    this.getConversations('active')
    this.webSockets
      .subscribeToConversationsChannel()
      .subscribe(this.websocketSuccess.bind(this))
  }

  setFilter(filter: any | null): void {
    this.filtering = false
    if (filter) {
      this.filter = filter.name
      this.getConversations(this.filter)
    } else {
      this.filter = 'All Messages'
      this.getConversations('active')
    }
  }

  // TODO: add back the open conversation logic
  getConversations(scope: string): void {
    this.chatService
      .getConversations(scope)
      .subscribe((threads: MessageThread[]) => {
        this.threads = threads
        // if (res && res.length > 0 && !this.isMobile) {
        this.openConversation(this.threads[0], 0)
        // }
      })
  }

  addNew(): void {
    if (!this.threads[0] || !this.threads[0].isBlank) {
      const newMessage = new MessageThread({ read: 'true', is_blank: true })
      this.threads.unshift(newMessage)
      this.openConversation(this.threads[0], 0)
    }
  }

  openConversation(thread: MessageThread, index: number): void {
    this.currentConversationService.openConversation({
      option: 'current_conversation',
      value: [thread, index]
    })
    if (!thread.read) {
      thread.setRead()
    }
  }

  // TODO: will need to be rewritten to handle incoming data from elixir backend from boon instead of zaplio
  websocketSuccess(data: any): void {
    // let newThread: boolean = true
    // this.threads.map((thread, index) => {
    //   const isSameThread = thread.id === data.conversation_id
    //   const incomingMessage = data.message.direction === 'inbound'
    //   const isThreadOpen = this.selectedIndex === index
    //   if (isSameThread) {
    //     newThread = false
    //     thread.last_message = data.message.body
    //     thread.last_message_date = moment(data.message.created_at).format(
    //       'h:mm a'
    //     )
    //     if (incomingMessage && !isThreadOpen) {
    //       thread.read = 'false'
    //     }
    //   }
    // })
    // if (newThread) {
    //   const thread = new MessageThread(data.conversation)
    //   this.threads.unshift(thread)
    //   this.selectedIndex = this.selectedIndex === 0 ? 1 : this.selectedIndex + 1
    // }
  }

  // TODO: modify to work with readonly
  findThreadByPhone(thread: MessageThread): MessageThread | undefined {
    return undefined
    // const find = this.threads.find((mappedThread, index) => {
    //   const parsedNumber = thread.contact_number.slice(-10)
    //   const parsedMapNumber = mappedThread.contact_number.slice(-10)

    //   if (parsedNumber === parsedMapNumber && index !== 0) {
    //     this.threads.splice(0, 1)
    //     const newIndex = index - 1
    //     this.openConversation(this.threads[newIndex], true, newIndex)
    //     return true
    //   } else {
    //     return false
    //   }
    // })
    // return find
  }

  // creates a contact and loads conversation
  // TODO: modify to work with readonly observable array
  createAndLoadConversation(thread: MessageThread): void {
    // const contactData = { phone_number: thread.contact_number }
    // const loader = this.loadingCtrl.create({
    //   content: 'Creating contact...'
    // })
    // loader.present().then(() => {
    //   this.salesService.createContact(contactData).subscribe(
    //     (response: Contact) => {
    //       if (response) {
    //         this.threads.splice(0, 1)
    //         this.threads.unshift(new MessageThread(response))
    //         this.openConversation(this.threads[0], true, 0)
    //         loader.dismiss()
    //       }
    //     },
    //     (err: Error) => {
    //       loader.dismiss()
    //     }
    //   )
    // })
  }

  openOrCreate(thread: MessageThread): void {
    if (!this.findThreadByPhone(thread)) {
      this.createAndLoadConversation(thread)
    }
  }
}
