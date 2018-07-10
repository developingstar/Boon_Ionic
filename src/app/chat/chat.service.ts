import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { environment } from '../../environments/environment'
import { MessageThread } from './message-thread.model'
import { Message } from './message.model'
// import * as API from './messages.api.model'

@Injectable()
export class ChatService {
  readonly url: string = environment.apiBaseUrl
  readonly data: any
  readonly limit: number = 10
  readonly offset: number = 0
  readonly resolved: any
  readonly headers: any

  constructor(readonly http: HttpClient) {
    this.data = null
  }

  // This is test data until the backend is set up.

  public getConversations(scope: any): Observable<MessageThread[]> {
    return this.http
      .get('http://localhost:8100/assets/conversations.test.json')
      .map((response: MessageThread[]) =>
        response.map(
          (messageThread: MessageThread) => new MessageThread(messageThread)
        )
      )
    // return Observable.of(this.stuff)
    /*return this.http.get('conversations' + '?scope=' + scope).map((response: MessageThread[]) =>
      response.map((messageThread: MessageThread) => new MessageThread(messageThread))
    )*/
  }

  public getConversation(id: number): Observable<Message[]> {
    return this.http
      .get('http://localhost:8100/assets/messages.test.json')
      .map((response: Message[]) =>
        response.map((message: Message) => new Message(message))
      )
    //    return this.http.get(this.url + 'conversations/' + id  + '/messages').map((response: Message[]) =>
    //     response.map((message: Message) => new Message(message))
    //   )
  }

  public updateConversation(
    id: number,
    body: Chat.API.IUpdateConversation
  ): Observable<any> {
    return this.http
      .put('conversations/' + id, body)
      .map((response: Response) => {
        if (response.json()) {
          return response.json()
        } else {
          return Observable.throw({
            message: 'Internal Server Error',
            response: response
          })
        }
      })
  }

  public deleteConversation(conversationId: any): Observable<void> {
    return this.http
      .delete('conversations/' + conversationId)
      .map((response: Response) => {
        if (response.status !== 200) {
          Observable.throw({
            message: 'Internal Server Error',
            response: response
          })
        }
      })
  }

  public getContactName(id: number): Observable<any> {
    return this.http
      .get('contact-name' + '?conv=' + id)
      .map((data: Response) => {
        return data.json()
      })
  }

  public sendMsg(conversationId: number, message: any): Observable<any> {
    const msgBody = { message: { body: message.body } }
    return this.http
      .post('conversations/' + conversationId + '/messages', msgBody)
      .map((data: Response) => {
        return data.json()
      })
  }
}
