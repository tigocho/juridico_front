// const webpack = require('webpack')
// const { GenerateSW } = require('workbox-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_BASE_URL
    : '/',

  transpileDependencies: ['vuetify'],

  // chainWebpack: config => {
  //   config.performance
  //     .maxEntrypointSize(4000000000)
  //     .maxAssetSize(4000000000)
  // },

  // configureWebpack: {
  //   plugins: [
  //     new webpack.ProvidePlugin({
  //       mapboxgl: 'mapbox-gl'
  //     }),
  //     new GenerateSW({
  //       // Configuración del precaching
  //       runtimeCaching: [
  //         {
  //           urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
  //           handler: 'CacheFirst'
  //         }
  //         // Puedes agregar más patrones y configuraciones según tus necesidades
  //       ]
  //     })
  //   ]
  // },

  pluginOptions: {
    i18n: {
      locale: 'es',
      fallbackLocale: 'es',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
