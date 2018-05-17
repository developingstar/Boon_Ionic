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

export function showToast(
  toastController: ToastController,
  message: string,
  duration: number = 2000,
  type: boolean = true /* true: success, false: warning */
): void {
  const toastMessage = type
    ? toastController.create({
        ...toastSuccessDefaults,
        duration: duration,
        message: message
      })
    : toastController.create({
        ...toastWarningDefaults,
        duration: duration,
        message: message
      })

  if (toastMessage) toastMessage.present()
}
