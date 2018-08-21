import { environment } from '@environment/environment'
import { showToast } from './utils/toast'

declare var window: any

// Put all code that you want exposed to PureScript in here.
// See also src/purescript/Bridge.{purs,js}
window.PureScriptBridge = {
  apiBaseUrl: environment.apiBaseUrl,
  showToast: showToast
}
