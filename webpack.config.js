const path = require('path');
var webpack = require('webpack');
const merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const buildPath = 'build';

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, buildPath)
}

const common = {
  entry: {
    index: './src/js/index.js',
    about: './src/js/about.js'
  },
  output: {
    path: PATHS.build,
    publicPath: '/' + buildPath + '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['index', 'about'],
      minChunks: 2
    }),
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackPlugin({
      favicon: './src/img/favicon.ico',
      filename: './index.html',
      template: './src/index.html',
      inject: 'body',
      hash: true,
      chunks: ['vendors', 'index'],
      minify: {
        removeComments: true,
        collapseWhitspace: false
      }
    }),
    new HtmlWebpackPlugin({
      favicon: './src/img/favicon.ico',
      filename: './about.html',
      template: './src/about.html',
      inject: 'body',
      hash: true,
      chunks: ['vendors', 'about'],
      minify: {
        removeComments: true,
        collapseWhitspace: false
      }
    })
  ]
}

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      hot: true,
      inline: true,
      progress: true,

      stats: 'errors-only',

      host: process.env.HOST,
      port: process.env.PORT || 2900
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    output: {
      path: PATHS.build,
      publicPath: '/',
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].chunk.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
   });
}