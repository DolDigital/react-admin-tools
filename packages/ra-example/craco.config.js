const { enableCKEWebpackConfigPlugin } = require('@doldigital/ra-ckeditor-adv-input/lib/craco.config')

module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      return enableCKEWebpackConfigPlugin(webpackConfig, { env, paths });
    }
  }
}