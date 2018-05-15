import { Component } from '@angular/core'
import { AlertController, IonicPage, NavParams } from 'ionic-angular'
import { Observable } from 'rxjs'

import { ReactivePage } from '../utils/reactive-page'
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
    public alertCtrl: AlertController,
    private readonly integrationsService: IntegrationsService
  ) {
    super(initialState)
    this.isChanged = false
  }

  ionViewCanLeave(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        buttons: [
          {
            handler: () => {
              this.uiActions.next({ name: 'update_service' })
              resolve(true)
            },
            text: 'Save'
          },
          {
            handler: () => {
              resolve(true)
            },
            text: "Don't Save"
          }
        ],
        subTitle:
          'You have chaged somethingsomething. Do you want to save them?',
        title: 'Confirm'
      })
      if (!this.isChanged) resolve(true)
      else alert.present()
    })
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
          .map((service) => ({
            ...state,
            service: service
          }))
      default:
        return Observable.of(state)
    }
  }
}
