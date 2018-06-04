import { Injectable } from '@angular/core'

import { Observable, Subscriber } from 'rxjs'

@Injectable()
export class WebSocketsService {
  // private cable: any
  // private conversationsChannel: any

  constructor() {
    // This logic will be replaced by whatever web socket library we use with elixir. This was specific to rails action cable
    // local
    // this.cable = ActionCable.createConsumer(`wss://localhost:3000/cable?token=${this.authService.token}`)
    // development
    // this.cable = ActionCable.createConsumer(
    //   `wss://api.rails.zaplio.com/cable?token=${this.authService.token}`
    // )
  }
  subscribeToConversationsChannel(): Observable<any> {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      // this.conversationsChannel = this.cable.subscriptions.create(
      //   'ConversationsChannel',
      //   {
      //     connected: () => {
      //       // tslint:disable-next-line:no-console
      //       console.log('CONNECTED: ')
      //     },
      //     disconnected: () => {
      //       // tslint:disable-next-line:no-console
      //       console.log('DISCONNECTED: ')
      //     },
      //     received: (data: any) => {
      //       // tslint:disable-next-line:no-console
      //       console.log('RECEIVED CONVERSATIONS CHANNEL: ', data)
      //       subscriber.next(data)
      //     },
      //     rejected: () => {
      //       // tslint:disable-next-line:no-console
      //       console.log('REJECTED: ')
      //     },
      //     update_read: (conversation_id: number) => {
      //       // tslint:disable-next-line:no-console
      //       console.log('UPDATE_READ: ', conversation_id)
      //       return this.conversationsChannel.perform('update_read', {
      //         conversation_id: conversation_id
      //       })
      //     }
      //   }
      // )
    })
  }

  subscribeToConversationChannel(): Observable<any> {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      // this.conversationsChannel = this.cable.subscriptions.create(
      //   'ConversationChannel',
      //   {
      //     connected: () => {
      //       // tslint:disable-next-line:no-console
      //       console.log('CONNECTED: ')
      //     },
      //     disconnected: () => {
      //       // tslint:disable-next-line:no-console
      //       console.log('DISCONNECTED: ')
      //     },
      //     received: (data: any) => {
      //       // tslint:disable-next-line:no-console
      //       console.log('RECEIVED: ', data)
      //       subscriber.next(data)
      //     },
      //     rejected: () => {
      //       subscriber.error('REJECTED')
      //     },
      //     update_read: (conversation_id: number) => {
      //       // tslint:disable-next-line:no-console
      //       console.log('UPDATE_READ: ', conversation_id)
      //       return this.conversationsChannel.perform('update_read', {
      //         conversation_id: conversation_id
      //       })
      //     }
      //   }
      // )
    })
  }
}
