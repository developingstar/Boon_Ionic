exports.apiBaseUrl = function() {
  return typeof PureScriptBridge !== 'undefined'
    ? PureScriptBridge.apiBaseUrl
    : ''
}

exports.showToast = function(type) {
  return function(duration) {
    return function(msg) {
      return function() {
        if (typeof PureScriptBridge !== 'undefined') {
          PureScriptBridge.showToast(
            PureScriptBridge.ToastController,
            msg,
            duration,
            type == 'success'
          )
        }
      }
    }
  }
}

exports.appendFile = function(formData) {
  return function(name) {
    return function(value) {
      return function() {
        if (typeof PureScriptBridge !== 'undefined') {
          formData.append(name, value)
        }
      }
    }
  }
}
