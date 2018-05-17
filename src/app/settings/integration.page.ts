import { Component } from '@angular/core'
import { IonicPage, NavParams, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { ReactivePage } from '../utils/reactive-page'
import { toastSuccessDefaults } from '../utils/toast'
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
  constructor(
    public navParams: NavParams,
    private readonly toastController: ToastController,
    private readonly integrationsService: IntegrationsService
  ) {
    super(initialState)
  }

  public updateService(): void {
    this.uiActions.next({ name: 'update_service' })
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
      .map((service) => ({
        name: 'edit',
        service: service
      }))
    switch (action.name) {
      case 'edit':
        return selectedService
      case 'update_service':
        return this.integrationsService
          .updateService(serviceID, state.service)
          .map((service) => {
            this.toast('Updated token successfully.')
            return {
              ...state,
              service: service
            }
          })
      default:
        return Observable.of(state)
    }
  }

  private toast(message: string): void {
    this.toastController
      .create({
        ...toastSuccessDefaults,
        message: message
      })
      .present()
  }
}
