const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack') // 多进程模型，能加速代码构建
const os = require('os') // node.js os 拿到系统信息
const chalk = require('chalk');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // 进度条
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

module.exports = {
  // webpack 4.x 中, 有一个很大的特性, 就是 约定大于配置。 默认约定的打包入口路径是 src -> index.js
  entry: ['./src/index.js'],

  resolve: {
    extensions: ['.js', '.jsx', '.json'], // 表示这几个文件得后缀名可以省略不写
  },

  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        // loader: 'babel-loader',
        // 把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: 'happypack/loader?id=happyBabel',
        exclude: /node_modules/, // 千万别忘了添加 exclude 排除项
      },

      // 大家可以在 css-loader 之后利用 ? 追加参数
      // 其中, 有個固定的参数, 叫做 modules, 表示为 普通的 css样式表, 启用模块化
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'happypack/loader?id=happyStyleScss' }),
      },
      {
        test: /\.css$/, // 问题：不加上此 Loader 读不到 antd 文件 一直报错
        use: [
          { loader: 'style-loader' },
          {
            loader: require.resolve('css-loader'),
          },
        ],
      },
      // {
      //   test: /\.(less)$/,
      //   // exclude: /node_modules/,
      //   include: [
      //     resolve('./node_modules/antd/lib'),
      //     resolve('./node_modules/_antd@3.19.2@antd/lib')
      //     // resolve('./src/static'),
      //   ],
      //   loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'happypack/loader?id=happyStyleLess' }),
      // },

      {
        test: /\.(png|jpg|gif|svg|bmp|eot|woff|woff2|ttf)$/,
        loader: {
          loader: 'url-loader',
          options: {
            limit: 5 * 1024, // 图片大小 > limit 使用file-loader, 反之使用url-loader
            outputPath: 'images/', // 指定打包后的图片位置
          },
        },
      },
      {
        test: /\.mp4$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    // 去除moment的语言包
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr|hu/),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      // 如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: false,
    }),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyStyleScss',
      // 如何处理  用法和loader 的配置一样
      loaders: ['css-loader?sourceMap=true', 'sass-loader?sourceMap=true'],
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: false,
    }),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyStyleLess',
      // 如何处理  用法和loader 的配置一样
      loaders: ['css-loader?sourceMap=true', 'less-loader?sourceMap=true'],
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: false,
    }),
    // 提取css
    new ExtractTextPlugin('style.[hash:4].css'),
    // 创建一个插件的实例对象
    new ProgressBarPlugin({
      format: chalk.blue.bold("build  ") + chalk.cyan("[:bar]") + chalk.green.bold(':percent') + ' (' + chalk.magenta(":elapsed") + ' seconds) ',
      clear: false
    }),
    // new CleanWebpackPlugin(["dist"]),
    // new CopyWebpackPlugin([{// 复制static到dist
    //   from: __dirname + '/src/static',// 打包的静态资源目录地址
    //   to: './static' // 打包到dist下面的static
    // }]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'), // 模板
      filename: 'index.html',
      inject: 'body', // 允许插件修改哪些内容，包括head与body
      hash: true, // 是否添加hash值
      minify: { // 压缩HTML文件
        removeComments: true,// 移除HTML中的注释
        collapseWhitespace: true // 删除空白符与换行符
      },
      chunksSortMode: 'none', // 如果使用webpack4将该配置项设置为'none'
      // favicon: path.resolve(__dirname, 'src/Assets/logo_s.png')
    }),
  ],

}