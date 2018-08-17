const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',

  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },

  mode: 'development',
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { test: /\.js$/, enforce: 'pre', loader: 'source-map-loader' },
      { test: /\.(png|gif|jpg)$/, loader: 'url-loader' },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // css-loader can provide css modules
              modules: true,
              localIdentName: '[local]--[hash:base64:5]'
            }
          }
        ]
      },
      // { test: /\.svg$/, loader: 'svg-inline-loader' },
      // Load svg with img tags for now.
      { test: /\.svg$/, loader: 'file-loader' }
    ]
  },

  devServer: {
    host: '0.0.0.0',
    publicPath: '/',
    proxy: {
      '/api': 'http://localhost:8000',
      '/storage': 'http://localhost:8000'
    }
  },

  plugins: [new HtmlWebpackPlugin({ template: __dirname + '/src/index.html' })]
};
