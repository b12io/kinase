var path = require('path')

module.exports = {
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ]
  },
  entry: {
    background: 'background.js',
    main: 'main.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'eslint-loader',
        enforce: 'pre'
      }, {
        test: /\.js$/,
        exclude: [/node_modules/, /.*\.min\.js/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: [
              'transform-runtime',
              'transform-object-rest-spread'
            ]
          }
        }
      }
    ]
  },
  devtool: 'cheap-source-map'
}
