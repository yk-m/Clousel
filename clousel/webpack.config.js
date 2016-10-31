var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: {
    index: path.resolve('./assets/js/index'),
    // shopItemList: path.resolve('./assets/js/shop-item-list'),
    itemList: path.resolve('./assets/js/item-list'),
    userItemList: path.resolve('./assets/js/user-item-list'),
  }, // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
    path: path.resolve('./assets/bundles/'),
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
          presets:['es2015', 'react']
        },
      }, // to transform JSX into JS
    ],
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
}