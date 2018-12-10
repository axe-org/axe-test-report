const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  baseUrl: './',
  chainWebpack: config => {
    config
      .plugin('copyPlugin')
      .use(CopyWebpackPlugin, [[{from: 'public/speedscope/index.html', to: 'speedscope'}]])
  }
}
