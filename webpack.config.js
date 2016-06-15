var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var precss = require('precss')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loaders: [ 'eslint' ],
        include: [
          path.resolve(__dirname, 'src')
        ]
      }
    ],
    loaders: [
      {
        loaders: [ 'react-hot', 'babel-loader' ],
        include: [
          path.resolve(__dirname, 'src')
        ],
        test: /\.js$/,
        plugins: [ 'transform-runtime' ]
      },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },

      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.svg/,
        loader: 'svg-url-loader'
      }
    ]
  },
  postcss: function () {
    return [ autoprefixer, precss ]
  }
}