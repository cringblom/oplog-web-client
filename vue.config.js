/*eslint-env node*/
module.exports = {
  devServer: {
    port: 4000,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true
      }
    }
  }
}
