import { Injectable } from '@angular/core'
import { AlertController } from 'ionic-angular'

@Injectable()
export class AlertService {
  constructor(public alertCtrl: AlertController) {}

  showSaveConfirmDialog(handleYes: any, handleNo: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        buttons: [
          {
            handler: () => {
              resolve(handleYes())
            },
            text: 'Yes'
          },
          {
            handler: () => {
              resolve(handleNo())
            },
            text: 'No'
          }
        ],
        subTitle:
          'You have changed something. Are you sure you want to leave without saving?',
        title: 'Confirm'
      })
      alert.present()
    })
  }

  showRemoveConfirmDialog(
    message: string,
    handleYes: any,
    handleNo?: any
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const alert = this.alertCtrl.create({
        buttons: [
          {
            handler: () => {
              resolve(handleYes())
            },
            text: 'Yes'
          },
          {
            handler: () => {
              resolve(handleNo ? handleNo() : null)
            },
            text: 'No'
          }
        ],
        subTitle: message,
        title: 'Confirm'
      })
      alert.present()
    })
  }
}
