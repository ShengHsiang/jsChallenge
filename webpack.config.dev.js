const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const port = 3030;
const os = require('os');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
///////////////////获取本机ip///////////////////////
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
const myHost = getIPAdress();

module.exports = merge(baseWebpackConfig, {
  // development || production
  mode: 'development',
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),//开发服务运行时的文件根目录
    // historyApiFallback: true,//spa不跳转,history模式的路由需要true
    host: myHost,
    port: port,
    // disableHostCheck: true,
    // hot:true,
    quiet: true, // 除了初始启动信息之外的任何内容都不会被打印到控制台
    inline: true,// 实时刷新
    compress: true,// Enable gzip compression for everything served
    overlay: true, // Shows a full-screen overlay in the browser
    stats: "errors-only",// To show only errors in your bundle
    open: true, // When open is enabled, the dev server will open the browser.
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Application is running here http://${myHost}:${port}`],
        notes: ['Bundle Success!']
      }
    }),
    new ErrorOverlayPlugin(),
  ],
});