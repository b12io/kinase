const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    modules: [
      path.join(__dirname, 'src/'),
      'node_modules',
    ],
  },
  entry: {
    background: 'background.js',
    main: 'main.jsx',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /.*\.min\.js/],
        use: 'eslint-loader',
        enforce: 'pre',
      }, {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /.*\.min\.js/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
            plugins: [
              'transform-runtime',
              'transform-object-rest-spread',
            ],
          },
        },
      }, {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  devtool: 'cheap-source-map',
};
