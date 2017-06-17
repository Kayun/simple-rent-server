const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

const serverBundle = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js'
  },
  devtool: 'source-map',
  target: 'node',
  externals: [
    nodeExternals()
  ],
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'awesome-typescript-loader' }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(['dist']),
    new webpack.BannerPlugin({
      banner: `require('source-map-support').install();`,
      raw: true,
      entryOnly: false
    }),
    new CheckerPlugin()
  ]
};

module.exports = serverBundle;
