const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const autoprefixer = require('autoprefixer')
const precss = require('precss')

const postcss = () => ([ autoprefixer, precss ])

const SOURCE = resolve(__dirname, 'src')

module.exports = (env = {}) => {
  const addItem = (add, item) => add ? item : undefined
  const ifProd = item => addItem(env.prod, item)
  const ifDev = item => addItem(!env.prod, item)
  const removeEmpty = array => array.filter(i => !!i)

  return {
    entry: {
      app: removeEmpty([
        ifDev('react-hot-loader/patch'),
        ifDev('webpack-dev-server/client?http://localhost:3000'),
        ifDev('webpack/hot/only-dev-server'),
        'babel-polyfill',
        './index'
      ])
    },
    output: {
      filename: env.prod ? '[name].[hash].js' : '[name].js',
      chunkFilename: '[name].[chunkhash].js',
      path: resolve(__dirname, 'dist'),
      pathinfo: !env.prod,
      publicPath: ''
    },
    context: SOURCE,
    devtool: env.prod ? 'hidden-source-map' : 'cheap-module-eval-source-map',
    bail: env.prod,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          loader: 'eslint',
          include: [ SOURCE ]
        }
      ],
      loaders: removeEmpty([
        {
          test: /\.jsx?$/,
          loader: 'babel',
          include: [ SOURCE ],
          query: {
            'presets': [ ['es2015', { 'modules': false }], 'react', 'stage-0' ],
            'plugins': removeEmpty([
              ifDev('react-hot-loader/babel'),
              'transform-runtime' ])
          }
        },
        ifProd({
          test: /\.[l|s]?[a|e|c]ss$/,
          loader: ExtractTextPlugin.extract({
            notExtractLoader: 'style',
            loader: 'css!postcss'
          })
        }),
        ifDev({
          test: /\.[l|s]?[a|e|c]ss$/,
          loaders: [ 'style', 'css', 'postcss' ]
        }),
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file'
        },
        {
          test: /\.(png|gif|jpg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file'
        }
      ])
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': env.prod ? '"production"' : '"development"'
        }
      }),

      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(new webpack.NoErrorsPlugin()),

      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.optimize.OccurrenceOrderPlugin()),
      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        }
      })),
      ifProd(new ExtractTextPlugin({
        filename: '[name].[chunkhash].css',
        allChunks: true
      })),
      ifProd(new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './assets/index.template.html',
        favicon: './assets/favicon.ico'
      })),
      ifProd(new CompressionPlugin({
        asset: '[file].gz',
        algorithm: 'gzip',
        test: /\.js$|\.css$/,
        threshold: 1100,
        minRatio: 0.8
      }))
    ])
  }
}
