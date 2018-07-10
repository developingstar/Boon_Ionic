import { Component } from '@angular/core'
import {
  IonicPage,
  Modal,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular'
import { Subscription } from 'rxjs'
import { SalesService } from '../../crm/sales.service'
import { UsersService } from '../../crm/users.service'
import { MessagesService } from '../../messages/messages.service'
import { AlertService } from '../../settings/alert.service'
import { Action } from '../action.model'
import { secondsInOptimalUnit } from '../duration.helpers'
import { Journey } from '../journey.model'
import {
  ActionData,
  ActionType,
  TriggerData,
  TriggerType
} from '../journeys.api.model'
import { JourneysService } from '../journeys.service'
import { AssignContactOwnerModalComponent } from '../modals/assign-contact-owner-modal.component'
import { AssignStageModalComponent } from '../modals/assign-stage-modal.component'
import { FieldUpdatedModalComponent } from '../modals/field-updated-modal.component'
import { PipelineAssignedModalComponent } from '../modals/pipeline-assigned-modal.component'
import { SendEmailModalComponent } from '../modals/send-email-modal.component'
import { SendTextModalComponent } from '../modals/send-text-modal.component'
import { StageAssignedModalComponent } from '../modals/stage-assigned-modal.component'
import { UpdateFieldModalComponent } from '../modals/update-field-modal.component'
import { WaitModalComponent } from '../modals/wait-modal.component'
import { Trigger } from '../trigger.model'
import { IEdge } from './journey-lib/draw.service'
import { Graph } from './journey-lib/graph'
import { INodeData } from './journey-lib/graph.service'
import { Node } from './journey-lib/node'
import { Rectangle } from './journey-lib/rectangle'

@IonicPage({
  defaultHistory: ['JourneysPage'],
  segment: 'journey-board/:id'
})
@Component({
  selector: 'page-journey-board',
  templateUrl: 'journey-board.html'
})
export class JourneyBoardPage {
  public triggers: any
  public actions: any
  public journey: Journey
  private graph: Graph
  private xOffset: number
  private yOffset: number
  private journeyId: number
  private nodeClick: Subscription

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public salesService: SalesService,
    public userService: UsersService,
    public messageService: MessagesService,
    public alert: AlertService,
    private modalController: ModalController,
    private journeysService: JourneysService
  ) {}

  ionViewDidEnter(): void {
    this.journeyId = Number(this.navParams.get('id'))
    this.graph = new Graph()
    this.nodeClick = Graph.getGraphService().onNodeClick.subscribe(
      (node: Node) => {
        if (node.nodeData.type === 'trigger') this.triggerClick(node)
        if (node.nodeData.type === 'action') this.actionClick(node)
      }
    )
    this.getJourney()
  }

  ionViewWillLeave(): void {
    this.graph.clearLayer()
    this.graph.destroy()
    this.nodeClick.unsubscribe()
  }

  public onItemDrop(e: any): void {
    this.addNode(
      e.dragData,
      undefined,
      e.nativeEvent.layerX - this.xOffset,
      e.nativeEvent.layerY - this.yOffset
    )
  }

  public createDropOffsets(e: any): void {
    const height = e.srcElement.clientHeight
    const width = e.srcElement.clientWidth
    this.yOffset = -(height / 2 - e.layerY) + height / 2
    this.xOffset = -(width / 2 - e.layerX) + width / 2 + 15
  }

  public save(): void {
    if (this.triggerCount() < 1 && this.actionCount() > 0) {
      this.alert.alert(
        'Missing Trigger',
        'You need a trigger to save a journey'
      )
    } else if (this.checkForEmptyEvents()) {
      this.unsetEventConfirm()
    } else if (this.checkForUnlinkedActions()) {
      this.unlikedActionsConfirm()
    } else {
      this.updateJourney()
    }
  }

  public publishJourney(): void {
    this.journeysService
      .publishJourney(this.journeyId)
      .subscribe((journey: Journey) => {
        this.journey.state = journey.state
      })
  }
  public stopJourney(): void {
    this.journeysService
      .stopJourney(this.journeyId)
      .subscribe((journey: Journey) => {
        this.journey.state = journey.state
      })
  }

  public getEventTitle(kind: string): string {
    return kind.replace(/\_/g, ' ')
  }

  private getJourney(): void {
    this.journeysService
      .journey(this.journeyId)
      .subscribe((journey: Journey) => {
        this.journey = journey
        journey.type === 'deal'
          ? this.setDealsActionsTriggerKinds()
          : this.setContactsActionsTriggerKinds()
        this.convertAndLoad()
      })
  }

  private addNode(data: INodeData, id?: string, x?: number, y?: number): Node {
    const node = this.graph.addNode(data, id, x, y)
    node.onDelete.subscribe(() => {
      this.delete(node)
      node.onDelete.unsubscribe()
    })
    return node
  }

  private convertAndLoad(): void {
    const triggers = this.journey.triggers
    const actions = this.journey.actions
    const nodeHeight = Rectangle.BASE_HEIGHT
    const nodeWidth = Rectangle.BASE_WIDTH
    const snapMargin = 60
    // Add Triggers in a vertical axis
    if (triggers.length > 0) {
      let counter = triggers.length > 1 ? 150 : 300
      triggers.forEach((trig) => {
        const data: any = { type: 'trigger', kind: trig.type.toString() }
        const node = this.addNode(data, trig.id!.toString(), 50, counter)
        counter = counter + nodeHeight + snapMargin
        this.addTriggerDetails(trig, node)
      })
    }
    // Add Actions in a horizontal Axis
    if (actions.length > 0) {
      let counter = 300
      actions.forEach((action) => {
        const data: any = { type: 'action', kind: action.type.toString() }
        const prevAction = actions.find(
          (x: any) => x.position === action.position! - 1
        )
        const node = this.addNode(data, action.id!.toString(), counter, 300)
        counter = counter + nodeWidth + snapMargin
        this.addActionDetails(action, node)
        // If there is a previous Action add an edge from previous action to current action
        if (prevAction) {
          this.graph.addEdge(prevAction.id!.toString(), action!.id!.toString())
        }
      })
    }
    // Add Edges from triggers to first Action
    if (actions.length > 0 && triggers.length > 0) {
      const firstAction = actions.find((x: any) => x.position === 1)
      triggers.forEach((trigger) => {
        this.graph.addEdge(trigger.id!.toString(), firstAction!.id!.toString())
      })
    }
  }

  private actionClick(node: Node): void {
    const action = this.journey.actions.find((a: Action) => {
      return a.getId().toString() === node.id()
    })
    const modalData = action ? { action: action } : {}
    const kind: any = node.nodeData.kind
    const modal = this.createEventModal(this.actionToModalName(kind), modalData)
    modal.present()
    if (action) {
      this.actionUpdateModal(modal, action, node)
    } else {
      this.actionAddModal(modal, node)
    }
  }

  private triggerClick(node: Node): void {
    const trigger = this.journey.triggers.find((t: Trigger) => {
      return t.getId().toString() === node.id()
    })
    const modalData = trigger ? { trigger: trigger } : {}
    const kind: any = node.nodeData.kind
    const modal = this.createEventModal(
      this.triggerToModalName(kind),
      modalData
    )
    modal.present()
    if (trigger) {
      this.triggerUpdateModal(modal, trigger, node)
    } else {
      this.triggerAddModal(modal, node)
    }
  }

  private delete(node: Node): void {
    const array: any =
      node.type === 'trigger' ? this.journey.triggers : this.journey.actions
    const nodeIndex = array.findIndex((el: any) => {
      return el.getId().toString() === node.id()
    })
    if (nodeIndex > -1) array.splice(nodeIndex, 1)
  }

  private actionUpdateModal(modal: Modal, action: Action, node: any): void {
    modal.onDidDismiss((data: ActionData) => {
      if (data !== null && data !== undefined) {
        if (action) {
          action.data = data
          this.addActionDetails(action, node)
        }
      }
    })
  }

  private actionAddModal(modal: Modal, node: any): void {
    modal.onDidDismiss((data: ActionData | null) => {
      if (data !== null) {
        const action = new Action(
          {
            data: data,
            journey_id: this.journeyId,
            type: node.nodeData.kind
          },
          node.id()
        )
        this.journey.actions.push(action)
        this.addActionDetails(action, node)
      }
    })
  }

  private triggerUpdateModal(modal: Modal, trigger: Trigger, node: any): void {
    modal.onDidDismiss((data: TriggerData) => {
      if (data !== null && data !== undefined) {
        if (trigger) {
          trigger.data = data
          this.addTriggerDetails(trigger, node)
        }
      }
    })
  }

  private triggerAddModal(modal: Modal, node: any): void {
    modal.onDidDismiss((data: TriggerData | null) => {
      if (data !== null) {
        const trigger = new Trigger(
          {
            data: data,
            journey_id: this.journeyId,
            type: node.nodeData.kind
          },
          node.id()
        )
        this.journey.triggers.push(trigger)
        this.addTriggerDetails(trigger, node)
      }
    })
  }

  private getActionsRepositioned(): Action[] {
    const edges = Graph.getDrawService().edges
    const actions = this.journey.actions
    const positions: IPositions[] = []

    // find last edge
    if (edges.length > 0) {
      const last = edges.slice(0)
      edges.forEach((edge: IEdge, index) => {
        edges.some((e: IEdge): any => {
          if (edge.target === e.origin) {
            last.splice(last.indexOf(edge), 1)
            return true
          }
        })
      })
      let currentEdge = last[0]
      positions.push({ id: currentEdge.target, position: actions.length })
      // get postition/id of last
      // iterate to find next and get position/id
      for (let i = edges.length - 1; i > 0; i--) {
        edges.some((edge: IEdge): boolean => {
          if (edge.target === currentEdge.origin) {
            positions.push({
              id: edge.target,
              position: i
            })
            currentEdge = edge
            return true
          } else {
            return false
          }
        })
      }
      // Rebuild actions array based on positions
      const newActions: Action[] = []
      positions.forEach((position: IPositions) => {
        this.journey.actions.find((action: Action): any => {
          if (
            Number(position.id) === action.id ||
            position.id === action.tempId
          ) {
            newActions.unshift(action)
          }
        })
      })
      return newActions
    } else {
      const newActions: Action[] = []
      return newActions
    }
  }

  private unlikedActionsConfirm(): void {
    const message = 'Some actions are unlinked and will be lost if you save'
    this.alert.confirm(
      'Save Journey',
      message,
      null,
      this.updateJourney.bind(this),
      'Save',
      'Go Back'
    )
  }

  private unsetEventConfirm(): void {
    const message =
      'Some events have not been configured and will be lost if you save'
    this.alert.confirm(
      'Save Journey',
      message,
      null,
      this.updateJourney.bind(this),
      'Save',
      'Go Back'
    )
  }

  private updateJourney(): void {
    if (Graph.getDrawService().edges.length > 0)
      this.journey.actions = this.getActionsRepositioned()
    const params = { journey: this.journey.toApiRepresentation() }
    this.journeysService
      .updateJourney(this.journeyId, params)
      .subscribe((journey: Journey) => {
        this.resetJourney(journey)
      })
  }

  private checkForEmptyEvents(): boolean {
    const anyBlankNode = Graph.getGraphService().nodes.some(
      (node: Node): boolean => {
        if (!node.nodeDetails.text()) {
          return true
        } else {
          return false
        }
      }
    )
    return anyBlankNode
  }

  private triggerCount(): number {
    let triggerCount = 0
    Graph.getGraphService().nodes.forEach((node: Node) => {
      if (node.type === 'trigger') triggerCount++
    })
    return triggerCount
  }

  private actionCount(): number {
    let actionCount = 0
    Graph.getGraphService().nodes.forEach((node: Node) => {
      if (node.type === 'action') actionCount++
    })
    return actionCount
  }

  private checkForUnlinkedActions(): boolean {
    const actionCounter = this.actionCount()
    if (actionCounter > 0) {
      return this.getActionsRepositioned().length !== actionCounter
    }
    return false
  }

  private resetJourney(journey: Journey): void {
    this.journey = journey
    this.graph.clearLayer()
    this.convertAndLoad()
  }

  private addActionDetails(action: any, node: Node): void {
    const types: any = {
      assign_owner: this.assignContactOwner,
      assign_stage: this.assignStage,
      send_email: this.sendEmail,
      send_text: this.sendText,
      update_field: this.updateField,
      wait: this.wait
    }
    if (types[action.type]) types[action.type].bind(this)(action, node)
  }

  private addTriggerDetails(trigger: any, node: Node): void {
    const types: any = {
      field_updated: this.fieldUpdated,
      pipeline_assigned: this.pipelineAssigned,
      stage_assigned: this.stageAssigned
    }
    if (types[trigger.type]) types[trigger.type].bind(this)(trigger, node)
  }

  // Actions methods start

  private assignContactOwner(action: any, node: Node): void {
    this.userService.user(action.data.owner_id).subscribe((details: any) => {
      node.updateDetails(details.name)
    })
  }
  private assignStage(action: any, node: Node): void {
    this.salesService.stage(action.data.stage_id).subscribe((details: any) => {
      node.updateDetails(details.name)
    })
  }
  private sendEmail(action: any, node: Node): void {
    this.messageService
      .emailTemplate(action.data.template_id)
      .subscribe((details: any) => {
        node.updateDetails(details.name)
      })
  }
  private sendText(action: any, node: Node): void {
    this.messageService
      .textTemplate(action.data.template_id)
      .subscribe((details: any) => {
        node.updateDetails(details.name)
      })
  }
  private updateField(action: any, node: Node): void {
    this.salesService.field(action.data.field_id).subscribe((details: any) => {
      node.updateDetails(details.name)
    })
  }
  private wait(action: any, node: Node): void {
    const record = secondsInOptimalUnit(action.data.for)
    node.updateDetails(`${record.value} ${record.unit}`)
  }
  // Actions End

  // Triggers methods start

  private pipelineAssigned(trigger: any, node: Node): void {
    this.salesService
      .pipeline(trigger.data.pipeline_id)
      .subscribe((details: any) => {
        node.updateDetails(details.name)
      })
  }
  private stageAssigned(trigger: any, node: Node): void {
    this.salesService.stage(trigger.data.stage_id).subscribe((details: any) => {
      node.updateDetails(details.name)
    })
  }
  private fieldUpdated(trigger: any, node: Node): void {
    this.salesService.field(trigger.data.field_id).subscribe((details: any) => {
      node.updateDetails(details.name)
    })
  }

  // Triggers end

  private actionToModalName(kind: ActionType): string {
    return Object({
      assign_owner: AssignContactOwnerModalComponent.name,
      assign_stage: AssignStageModalComponent.name,
      send_email: SendEmailModalComponent.name,
      send_text: SendTextModalComponent.name,
      update_field: UpdateFieldModalComponent.name,
      wait: WaitModalComponent.name
    })[kind]
  }

  private triggerToModalName(kind: TriggerType): string {
    return Object({
      field_updated: FieldUpdatedModalComponent.name,
      pipeline_assigned: PipelineAssignedModalComponent.name,
      stage_assigned: StageAssignedModalComponent.name
    })[kind]
  }

  private componentToCssClass(str: string): string {
    return str
      .split(/(?=[A-Z])/)
      .join('-')
      .toLowerCase()
  }

  private createEventModal(
    name: string,
    params: {} | { readonly action: Action } | { readonly trigger: Trigger }
  ): Modal {
    return this.modalController.create(name, params, {
      cssClass: this.componentToCssClass(name)
    })
  }

  private setDealsActionsTriggerKinds(): void {
    this.triggers = [
      { type: 'trigger', kind: 'pipeline_assigned' },
      { type: 'trigger', kind: 'stage_assigned' }
    ]
    this.actions = [
      { type: 'action', kind: 'assign_stage' },
      { type: 'action', kind: 'send_email' },
      { type: 'action', kind: 'send_text' },
      { type: 'action', kind: 'wait' }
    ]
  }
  private setContactsActionsTriggerKinds(): void {
    this.triggers = [{ type: 'trigger', kind: 'field_updated' }]
    this.actions = [
      { type: 'action', kind: 'assign_owner' },
      { type: 'action', kind: 'send_email' },
      { type: 'action', kind: 'send_text' },
      { type: 'action', kind: 'update_field' },
      { type: 'action', kind: 'wait' }
    ]
  }
}

interface IPositions {
  id: number | string
  position: number
}
