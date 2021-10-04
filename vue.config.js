const webpack = require('webpack')
const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, 'export'),
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_BASE_URL
    : '/',

  transpileDependencies: ['vuetify'],

  chainWebpack: config => {
    config.performance
      .maxEntrypointSize(4000000000)
      .maxAssetSize(4000000000)
  },

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl'
      })
    ]
  },

  pluginOptions: {
    i18n: {
      locale: 'es',
      fallbackLocale: 'es',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
