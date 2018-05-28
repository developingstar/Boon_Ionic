import { Component } from '@angular/core'
import { IonicPage, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { CurrentUserService } from '../auth/current-user.service'
import { pageAccess } from '../utils/app-access'
import { ReactivePage } from '../utils/reactive-page'
import { AlertService } from './alert.service'
import { initialState, IState, UserAction } from './integration.page.state'
import { IntegrationsService } from './integrations.service'
import { Service } from './service.model'

@IonicPage({
  segment: 'integration/:id'
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
    private readonly integrationsService: IntegrationsService,
    private currentUserService: CurrentUserService
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
    this.uiActions.next({ name: 'update_service' })
  }

  public tokenChanged(): void {
    this.service.subscribe((service: Service) => {
      this.isChanged =
        service.token !== this.originalService.token ? true : false
    })
  }

  get service(): Observable<Service> {
    return this.state.flatMap(
      (state) =>
        state.service ? Observable.of(state.service) : Observable.empty()
    )
  }

  protected initialAction(): UserAction {
    return { name: 'edit' }
  }

  protected reduce(state: IState, action: UserAction): Observable<IState> {
    const serviceID = Number(this.navParams.get('id'))
    const selectedService = this.integrationsService
      .service(serviceID)
      .map((service) => {
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
      })
    switch (action.name) {
      case 'edit':
        return selectedService
      case 'update_service':
        return this.integrationsService
          .updateService(serviceID, state.service)
          .map((service) => {
            this.isChanged = false
            this.originalService = new Service({
              id: service.id,
              name: service.name,
              token: service.token
            })
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
