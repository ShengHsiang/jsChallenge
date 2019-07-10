const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.config.base');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
});



