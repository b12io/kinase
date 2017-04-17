const path = require('path');

const customStyleLoader = {
  loader: 'style-loader',
  options: {
    attrs: {
      class: 'webpack-styles',
    },
  },
};

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
        // TODO: Figure out how to namespace external styles with CSS modules
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
