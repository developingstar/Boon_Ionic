import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { SortablejsOptions } from 'angular-sortablejs'
import {
  IonicPage,
  Modal,
  ModalController,
  NavParams,
  ToastController
} from 'ionic-angular'
import { Observable, Subject, Subscription } from 'rxjs'

import { Action } from './action.model'
import { Journey } from './journey.model'
import { initialState, IState, UserAction } from './journey.page.state'
import {
  ActionData,
  ActionType,
  IAction,
  IJourneyUpdateRequest,
  ITrigger,
  TriggerData,
  TriggerType
} from './journeys.api.model'
import { JourneysService } from './journeys.service'
import { Trigger } from './trigger.model'

import { FieldUpdatedModalComponent } from './modals/field-updated-modal.component'
import { PipelineAssignedModalComponent } from './modals/pipeline-assigned-modal.component'
import { StageAssignedModalComponent } from './modals/stage-assigned-modal.component'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { showToast } from '../utils/toast'
import { AssignOwnerModalComponent } from './modals/assign-owner-modal.component'
import { AssignStageModalComponent } from './modals/assign-stage-modal.component'
import { SendEmailModalComponent } from './modals/send-email-modal.component'
import { SendTextModalComponent } from './modals/send-text-modal.component'
import { UpdateFieldModalComponent } from './modals/update-field-modal.component'
import { WaitModalComponent } from './modals/wait-modal.component'

interface IOnUpdateEvent extends Event {
  readonly newIndex: number
  readonly oldIndex: number
}

@IonicPage({
  defaultHistory: ['JourneysPage'],
  segment: 'journey/:id'
})
@Component({
  selector: 'journey-page',
  templateUrl: 'journey.page.html'
})
export class JourneyPage implements OnInit, OnDestroy {
  // `isSorting` flag cannot be inside the state because emitting a new value,
  // on sorting, would break the interface
  public readonly isSorting: Subject<boolean> = new Subject()
  public readonly sortableOptions: SortablejsOptions = {
    onEnd: (event: Event) => {
      this.isSorting.next(false)
    },
    onStart: (event: Event) => {
      this.isSorting.next(true)
    },
    onUpdate: (event: IOnUpdateEvent) => {
      this.uiActions.next({
        name: 'reorder_actions',
        newPosition: event.newIndex,
        oldPosition: event.oldIndex
      })
    }
  }

  private readonly state: Observable<IState>
  private readonly uiActions: Subject<UserAction> = new Subject()
  private readonly journeyID: number
  private readonly stateSubscription: Subscription

  constructor(
    navParams: NavParams,
    private journeysService: JourneysService,
    private modalController: ModalController,
    private toastController: ToastController,
    private currentUserService: CurrentUserService
  ) {
    this.journeyID = Number(navParams.get('id'))
    this.state = this.uiActions
      .mergeScan((state, action) => this.reduce(state, action), initialState)
      .shareReplay()
    this.stateSubscription = this.state.subscribe()
  }

  ngOnInit(): void {
    this.uiActions.next({ name: 'init' })
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
  }

  public publishJourney(): void {
    this.uiActions.next({ name: 'publish_journey' })
  }

  public stopJourney(): void {
    this.uiActions.next({ name: 'stop_journey' })
  }

  public addNewAction(kind: ActionType): void {
    const modal = this.createEventModal(this.actionToModalName(kind), {})

    modal.present()
    modal.onDidDismiss((data: ActionData | null) => {
      if (data !== null) {
        this.uiActions.next({
          action: new Action({
            data: data,
            journey_id: this.journeyID,
            type: kind
          }),
          name: 'add_action'
        })
      }
    })
  }

  public updateAction(action: Action): void {
    const modal = this.createEventModal(this.actionToModalName(action.type), {
      action: action
    })

    modal.present()
    modal.onDidDismiss((data: ActionData | null) => {
      if (data !== null) {
        this.uiActions.next({
          action: new Action({
            ...action.toApiRepresentation(),
            data: data
          }),
          name: 'update_action'
        })
      }
    })
  }

  public deleteAction($event: MouseEvent, event: Action): void {
    $event.stopPropagation()
    this.uiActions.next({
      action: event,
      name: 'delete_action'
    })
  }

  public addNewTrigger(kind: TriggerType): void {
    const modal = this.createEventModal(this.triggerToModalName(kind), {})

    modal.present()
    modal.onDidDismiss((data: TriggerData | null) => {
      if (data !== null) {
        this.uiActions.next({
          name: 'add_trigger',
          trigger: new Trigger({
            data: data,
            journey_id: this.journeyID,
            type: kind
          })
        })
      }
    })
  }

  public updateTrigger(trigger: Trigger): void {
    const modal = this.createEventModal(this.triggerToModalName(trigger.type), {
      trigger: trigger
    })

    modal.present()
    modal.onDidDismiss((data: TriggerData | null) => {
      if (data !== null) {
        this.uiActions.next({
          name: 'update_trigger',
          trigger: new Trigger({
            ...trigger.toApiRepresentation(),
            data: data
          })
        })
      }
    })
  }

  public deleteTrigger($event: MouseEvent, event: Trigger): void {
    $event.stopPropagation()
    this.uiActions.next({
      name: 'delete_trigger',
      trigger: event
    })
  }

  public renameJourney(): void {
    this.uiActions.next({ name: 'rename_journey' })
  }

  get isLoading(): Observable<boolean> {
    return this.state.map((state) => state.isLoading)
  }

  get journey(): Observable<Journey> {
    return this.state.flatMap(
      (state) =>
        state.journey ? Observable.of(state.journey) : Observable.empty()
    )
  }

  get actionIds(): Observable<ReadonlyArray<number>> {
    return this.state.map(
      (state) =>
        state.journey ? state.journey.actions.map((action) => action.id!) : []
    )
  }

  get name(): Observable<FormControl> {
    return this.state.map((state) => state.name)
  }

  private reduce(state: IState, action: UserAction): Observable<IState> {
    switch (action.name) {
      case 'init':
        return this.loadJourneyState(state)
      case 'publish_journey':
        return this.setLoading(state).concat(
          this.journeysService
            .publishJourney(this.journeyID)
            .map((journey) => ({
              ...state,
              isLoading: false,
              journey: journey
            }))
        )
      case 'stop_journey':
        return this.setLoading(state).concat(
          this.journeysService.stopJourney(this.journeyID).map((journey) => ({
            ...state,
            isLoading: false,
            journey: journey
          }))
        )
      case 'add_action':
        if (state.journey === undefined) {
          return this.loadJourneyState(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              actions: [
                ...state.journey.toApiRepresentation().actions,
                action.action.toApiRepresentation()
              ]
            }
          })
        }
      case 'update_action':
        if (state.journey === undefined) {
          return this.loadJourneyState(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              actions: state.journey
                .toApiRepresentation()
                .actions.reduce((actions, event: IAction) => {
                  return [
                    ...actions,
                    event.id === action.action.toApiRepresentation().id
                      ? action.action.toApiRepresentation()
                      : event
                  ]
                }, [])
            }
          })
        }
      case 'delete_action':
        if (state.journey === undefined) {
          return this.loadJourneyState(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              actions: state.journey
                .toApiRepresentation()
                .actions.filter((a) => a.id !== action.action.id)
            }
          })
        }
      case 'reorder_actions':
        if (state.journey === undefined) {
          return this.loadJourneyState(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              actions: this.reorderActions(
                state.journey.toApiRepresentation().actions,
                action.oldPosition,
                action.newPosition
              )
            }
          })
        }
      case 'add_trigger':
        if (state.journey === undefined) {
          return this.loadJourneyState(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              triggers: [
                ...state.journey.toApiRepresentation().triggers,
                action.trigger.toApiRepresentation()
              ]
            }
          })
        }
      case 'update_trigger':
        if (state.journey === undefined) {
          return this.loadJourneyState(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              triggers: state.journey
                .toApiRepresentation()
                .triggers.reduce((triggers, event: ITrigger) => {
                  return [
                    ...triggers,
                    event.id === action.trigger.toApiRepresentation().id
                      ? action.trigger.toApiRepresentation()
                      : event
                  ]
                }, [])
            }
          })
        }
      case 'delete_trigger':
        if (state.journey === undefined) {
          return this.loadJourneyState(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              triggers: state.journey
                .toApiRepresentation()
                .triggers.filter(
                  (t) => t.id !== action.trigger.toApiRepresentation().id
                )
            }
          })
        }
      case 'rename_journey':
        if (state.journey === undefined || !state.name.valid) {
          return Observable.of(state)
        } else {
          return this.updateJourneyState(state, {
            journey: {
              name: state.name.value
            }
          })
        }
    }
  }

  private loadJourneyState(state: IState): Observable<IState> {
    return this.setLoading(state).concat(this.getJourney())
  }

  private updateJourneyState(
    state: IState,
    params: IJourneyUpdateRequest
  ): Observable<IState> {
    if (state.journey === undefined) {
      return this.loadJourneyState(state)
    } else {
      return this.setLoading(state).concat(
        this.journeysService
          .updateJourney(this.journeyID, params)
          .map((journey) => ({
            ...state,
            isLoading: false,
            journey: journey
          }))
          .catch((error) => {
            if (error.status === 422) {
              showToast(
                this.toastController,
                'Failed to update the journey.',
                2000,
                false
              )
            }

            return this.loadJourneyState(state)
          })
      )
    }
  }

  private setLoading(state: IState): Observable<IState> {
    return Observable.of({ ...state, isLoading: true })
  }

  private getJourney(): Observable<IState> {
    return this.journeysService.journey(this.journeyID).map((journey) => ({
      isLoading: false,
      journey: journey,
      name: new FormControl(journey.name, Validators.required)
    }))
  }

  private actionToModalName(kind: ActionType): string {
    return Object({
      assign_owner: AssignOwnerModalComponent.name,
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

  private reorderActions(
    actions: ReadonlyArray<IAction>,
    oldIndex: number,
    newIndex: number
  ): ReadonlyArray<IAction> {
    const withoutAction: ReadonlyArray<IAction> = [
      ...actions.slice(0, oldIndex),
      ...actions.slice(oldIndex + 1)
    ]

    return [
      ...withoutAction.slice(0, newIndex),
      actions[oldIndex],
      ...withoutAction.slice(newIndex)
    ]
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).JourneyPage !== undefined
  }
}
