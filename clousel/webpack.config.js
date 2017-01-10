// var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: {
    itemList:  __dirname + '/assets/js/item-list',
    userItemList:  __dirname + '/assets/js/user-item-list',
    headline:  __dirname + '/assets/js/headline',
  }, // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
    path:  __dirname + '/assets/bundles',
    filename: "[name].js",
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:
        {
          presets:['es2015', 'react'],
          plugins: [ "transform-class-properties" ],
        },
      }, // to transform JSX into JS
    ],
  },

  resolve: {
    root: __dirname + '/assets/js',
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
}