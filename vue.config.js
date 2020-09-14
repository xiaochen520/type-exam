module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/platform-framework': {
        target: 'https://www.advlink.cn',
        ws: true,
        changeOrigin: true,
      }
    },
    disableHostCheck: true
  }
}