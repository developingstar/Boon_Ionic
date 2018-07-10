const deepClone = require('clone-deep')
const ionicConfig = require('@ionic/app-scripts/config/webpack.config.js')
const path = require('path')
const webpack = require('webpack')

const productionEnv = process.env.ENV || 'prod'

function withInjectedEnv(initial, env) {
  const config = deepClone(initial)

  const environmentPath = path.resolve(
    'src',
    'environments',
    `environment.${env}.ts`
  )
  const replacementPlugin = new webpack.NormalModuleReplacementPlugin(
    /src\/environments\/environment\.ts/,
    environmentPath
  )

  config.plugins.push(replacementPlugin)

  config.resolve.alias = config.resolve.alias || {}
  config.resolve.alias = {
    '@environment/environment': environmentPath
  }

  return config
}


devConfig = withInjectedEnv(ionicConfig.dev, 'dev')

prodConfig = withInjectedEnv(ionicConfig.prod, productionEnv)

module.exports = {
  dev: devConfig,
  prod: prodConfig
}
