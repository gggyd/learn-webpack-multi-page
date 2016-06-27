'use strict';

const path = require('path');
const webpack = require('webpack');
var glob = require('glob');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const buildPath = 'build';

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, buildPath)
}

const entries = getEntry('src/js/*.js', 'src/js/');
const chunks = Object.keys(entries);

const common = {
  entry: entries,
  output: {
    path: PATHS.build,
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: chunks,
      minChunks: chunks.length
    }),
    new ExtractTextPlugin('css/[name].css')
  ]
}

const pages = Object.keys(getEntry('src/*.html', 'src/'));
pages.forEach(function(pathname) {
	let conf = {
		filename: './' + pathname + '.html', 
		template: './src/' + pathname + '.html', 
		inject: false
	};

	if (pathname in common.entry) {
		conf.favicon = './src/img/favicon.ico';
		conf.inject = 'body';
		conf.chunks = ['vendors', pathname];
		conf.hash = true;
	}
	common.plugins.push(new HtmlWebpackPlugin(conf));
});

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
    plugins: [
      new CleanPlugin([PATHS.build], {
        verbose: false
      }),
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

function getEntry(globPath, pathDir) {
	let files = glob.sync(globPath);
	let entries = {};
  let	entry;
  let dirname;
  let basename;
  let pathname;
  let extname;

	for (var i = 0; i < files.length; i++) {
		entry = files[i];
		dirname = path.dirname(entry);
		extname = path.extname(entry);
		basename = path.basename(entry, extname);
		pathname = path.join(dirname, basename);
		pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
		entries[pathname] = ['./' + entry];
	}
	return entries;
}