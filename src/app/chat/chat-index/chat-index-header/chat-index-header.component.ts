import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Observable } from 'rxjs'

import { Pipeline } from '../../../crm/pipeline.model'
import { SalesService } from '../../../crm/sales.service'
import { Stage } from '../../../crm/stage.model'

@Component({
  selector: 'chat-index-header',
  templateUrl: 'chat-index-header.component.html'
})
export class ChatIndexHeaderComponent implements OnInit {
  @Output() filterLeads = new EventEmitter()
  public pipelines: Observable<ReadonlyArray<Pipeline>>
  public stages: Observable<ReadonlyArray<Stage>>
  public filtering: boolean = false
  public filter: string = 'All Messages'
  public searching: boolean = false

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.pipelines = this.salesService.pipelines()
    this.stages = this.salesService.stages()
  }

  getStage(ids: number[]): Observable<Stage[]> {
    return this.stages.map((stages) => {
      return stages.filter((stage) => {
        return ids.indexOf(stage.id) === -1 ? false : true
      })
    })
  }

  search(e: any): void {
    const input = e.target.value
    if (input) {
      const testInput = /^[^1][0-9]{1}/.test(input)
      const searchString = testInput ? '1' + input : input
      // const scope = 'active&search=' + searchString
      this.filterLeads.emit({
        filter: searchString
      })
    } else {
      // TODO: output emitted to index to search for conv
      // this.getConversations('active')
    }
  }

  addNew(): void {
    // TODO: emit event to index to add new conversation to list
    // if (!this.threads[0] || !this.threads[0].is_blank) {
    //   const newMessage = new MessageThread({ read: 'true', is_blank: true })
    //   this.threads.unshift(newMessage)
    //   this.openConversation(this.threads[0], true, 0)
    // }
  }

  setFilter(filter: any | null): void {
    this.filterLeads.emit({
      filter: filter
    })
  }
}
