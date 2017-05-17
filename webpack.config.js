const path = require('path');

const customStyleLoader = {
  loader: 'style-loader',
  options: {
    attrs: {
      class: 'bundled-styles',
    },
  },
};

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    modules: [
      __dirname,
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
  entry: {
    background: 'background.js',
    setUp: 'setUp.jsx',
    tearDown: 'tearDown.jsx',
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
        use: 'babel-loader',
      }, {
        /**
         * Load custom styles as CSS modules, but don't namespace imported third-party styles
         * TODO(jrbotros): Figure out how to namespace external styles with CSS modules
         */
        test: /\.s?css$/,
        exclude: [/node_modules/],
        use: [
          customStyleLoader,
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
      {
        /**
         * Load third-party styles without CSS modules
         */
        test: /\.s?css$/,
        include: [/node_modules/],
        use: [
          customStyleLoader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devtool: 'cheap-source-map',
};
