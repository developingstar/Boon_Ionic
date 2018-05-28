import { ToastOptions } from 'ionic-angular'

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
