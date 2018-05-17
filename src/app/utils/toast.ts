import { ToastController, ToastOptions } from 'ionic-angular'

export const toastSuccessDefaults: ToastOptions = {
  cssClass: 'boon-toast-success',
  dismissOnPageChange: false,
  position: 'top',
  showCloseButton: true
}

export const toastWarningDefaults: ToastOptions = {
  cssClass: 'boon-toast-warning',
  dismissOnPageChange: true,
  position: 'top',
  showCloseButton: true
}

export function toast(toastController: ToastController, message: string, type: boolean = true /* true: success, false: warning */): void {
  const toastMessage = type ? toastController
    .create({
      ...toastSuccessDefaults,
      duration: 2000,
      message: message,
    }) : toastController
    .create({
      ...toastWarningDefaults,
      duration: 2000,
      message: message,
    })

  if (toastMessage)
      toastMessage.present()
}
