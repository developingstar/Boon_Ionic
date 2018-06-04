import {
  Component,
  EventEmitter,
  NgZone,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import { Content, NavController, NavParams, Platform } from 'ionic-angular'
import { SalesService } from '../../crm/sales.service'
import { ChatService } from '../chat.service'
import { CurrentConversation } from '../current-conversation.model'
import { CurrentConversationService } from '../current-conversation.service'
import { MessageThread } from '../message-thread.model'
import { Message } from '../message.model'
import { WebSocketsService } from '../websockets.service'

@Component({
  selector: 'chat-show',
  templateUrl: 'chat-show.component.html'
})
export class ChatShowComponent {
  @Output() openThreads = new EventEmitter()
  @Output() openOrCreate = new EventEmitter()
  @ViewChild(Content) content: Content
  @ViewChild('messageInput') messageInput: any

  public messages: any[] = []
  public threadData: MessageThread
  public conversationId: number
  public message: any = {}
  public lead: any = {}
  public conversationsChannel: any
  public nameNumberToggle = true
  public pipeline: string
  public stage: string

  constructor(
    private chatService: ChatService,
    private currentConversationService: CurrentConversationService,
    private salesService: SalesService,
    private webSockets: WebSocketsService,
    private zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform
  ) {}

  ngOnInit(): void {
    this.currentConversationService.notifyObservable.subscribe(
      (res: CurrentConversation) => {
        this.threadData = res.threadData
        this.conversationId = res.threadData.id
        this.getConversation()
      }
    )
    this.webSockets
      .subscribeToConversationChannel()
      .subscribe(this.websocketSuccess.bind(this))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.threadData.previousValue !== changes.threadData.currentValue) {
      if (!changes.threadData.currentValue.is_blank) {
        this.conversationId = changes.threadData.currentValue.id
        this.getConversation()
        this.getPipelineAndStage()
      } else {
        this.messages = []
        this.conversationId = 0
      }
    }
  }

  websocketSuccess(data: any): void {
    this.zone.run(() => {
      if (data.conversation_id === this.conversationId) {
        this.messages.push(data.message)
      }
    })
  }

  shouldShowDateSeparator(i: number): boolean {
    if (this.messages[i] && this.messages[i - 1]) {
      const currentDate: Date = new Date(this.messages[i].created_at)
      const previousDate: Date = new Date(this.messages[i - 1].created_at)

      const fullYearsMatch: boolean =
        currentDate.getFullYear() === previousDate.getFullYear()
      const monthsMatch: boolean =
        currentDate.getMonth() === previousDate.getMonth()
      const daysMatch: boolean =
        currentDate.getDate() === previousDate.getDate()

      if (fullYearsMatch && monthsMatch && daysMatch) {
        return false
      } else {
        return true
      }
    } else if (this.messages[i] && !this.messages[i - 1]) {
      return true
    } else {
      return false
    }
  }

  getConversation(): void {
    if (this.conversationId) {
      this.chatService
        .getConversation(this.conversationId)
        .subscribe((res: Message[]) => {
          this.messages = res
        })
    }
  }

  sendMsg(message: Message): void {
    if (!this.threadData.isBlank) {
      this.chatService
        .sendMsg(this.conversationId, message)
        .subscribe((res: any) => {
          message.body = ''
        })
    } else {
      alert('Please add a Phone number')
    }
  }

  newLeadBlur(event: Event): void {
    const isNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
      this.threadData.leadNumber
    )
    if (isNumber) {
      this.openOrCreate.emit({
        thread: this.threadData
      })
    }
  }

  goToThreads(): void {
    this.openThreads.emit()
  }

  openEditLead(): void {
    const lead = {
      lead: {
        first_name: this.threadData.leadFirst,
        id: this.threadData.leadId,
        last_name: this.threadData.leadLast,
        phone: this.threadData.leadNumber
      }
    }

    this.navCtrl.push('LeadsPage', lead)
  }

  getPipelineAndStage(): void {
    this.salesService.lead(this.threadData.leadId).subscribe((lead) =>
      this.salesService.stage(lead.stageId).subscribe((stage) => {
        this.salesService
          .pipeline(stage.pipelineId)
          .subscribe(
            (res2 = { id: 0, name: 'Oops', stageOrder: [] }) =>
              (this.pipeline = res2.name)
          )
        this.stage = stage.name
      })
    )
  }
}
