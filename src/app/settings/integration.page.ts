import { Component } from '@angular/core'
import { IonicPage, NavParams, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { showToast } from '../utils/toast'
import { AlertService } from './alert.service'
import { initialState, IState, UserAction } from './integration.page.state'
import { IntegrationsService } from './integrations.service'
import { Service } from './service.model'

@IonicPage({
  segment: 'integration/:name'
})
@Component({
  selector: 'integration-page',
  templateUrl: 'integration.page.html'
})
export class IntegrationPage extends ReactivePage<IState, UserAction> {
  navSubscribe: any
  originalService: Service
  isChanged: boolean

  constructor(
    public navParams: NavParams,
    public alertService: AlertService,
    private currentUserService: CurrentUserService,
    private readonly toastController: ToastController,
    private readonly integrationsService: IntegrationsService
  ) {
    super(initialState)
    this.isChanged = false
  }

  ionViewCanLeave(): Promise<boolean> {
    if (this.isChanged)
      return this.alertService.showSaveConfirmDialog(
        this.handleYes,
        this.handleNo
      )
    else return Promise.resolve(true)
  }

  public updateService(): void {
    if (this.originalService) {
      this.uiActions.next({ name: 'update_service' })
    } else {
      this.uiActions.next({ name: 'create_service' })
    }
  }

  public tokenChanged(): void {
    this.service.subscribe((service: Service) => {
      this.isChanged =
        !this.originalService || service.token !== this.originalService.token
          ? true
          : false
    })
  }

  get service(): Observable<Service> {
    return this.state.flatMap(
      (state) =>
        state.service ? Observable.of(state.service) : Observable.empty()
    )
  }

  get buttonName(): Observable<string> {
    return this.state.flatMap(
      (state) =>
        state.name === 'create'
          ? Observable.of('Create Token')
          : Observable.of('Update Token')
    )
  }

  protected initialAction(): UserAction {
    return { name: 'edit' }
  }

  protected reduce(state: IState, action: UserAction): Observable<IState> {
    const serviceName = this.navParams.get('name')
    const selectedService = this.integrationsService
      .services()
      .map((services) => {
        const service = services.find((s: Service) => s.name === serviceName)
        if (service) {
          if (!this.originalService) {
            this.originalService = new Service({
              id: service.id,
              name: service.name,
              token: service.token
            })
          }
          return {
            name: 'edit',
            service: service
          }
        } else {
          return {
            name: 'create',
            service: {
              id: 0,
              name: serviceName,
              token: ''
            }
          }
        }
      })
    switch (action.name) {
      case 'edit':
        return selectedService
      case 'create_service':
        return this.integrationsService
          .createService(state.service)
          .map((service) => {
            this.isChanged = false
            this.originalService = new Service({
              id: service.id,
              name: service.name,
              token: service.token
            })
            showToast(this.toastController, 'Created token successfully.')
            return {
              name: 'edit',
              service: service
            }
          })
      case 'update_service':
        const serviceId = state.service ? state.service.id : 1
        return this.integrationsService
          .updateService(serviceId, state.service)
          .map((service) => {
            this.isChanged = false
            this.originalService = new Service({
              id: service.id,
              name: service.name,
              token: service.token
            })
            showToast(this.toastController, 'Updated token successfully.')
            return {
              ...state,
              service: service
            }
          })
      default:
        return Observable.of(state)
    }
  }

  private handleYes(): boolean {
    return true
  }

  private handleNo(): boolean {
    return false
  }

  private async ionViewCanEnter(): Promise<boolean> {
    const role = await this.currentUserService
      .role()
      .first()
      .toPromise()
    return pageAccess(role).IntegrationPage !== undefined
  }
}
