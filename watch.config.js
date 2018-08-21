const deepClone = require('clone-deep')
const ionicConfig = require('@ionic/app-scripts/config/watch.config.js')

const config = deepClone(ionicConfig)

// Reload the browser page when pulp generates a new file.
config.srcFiles.paths = config.srcFiles.paths.concat(['{{BUILD}}/purescript.js'])

module.exports = config;
