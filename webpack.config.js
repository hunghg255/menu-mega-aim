const path = require('path');
module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    watchContentBase: true,
  },
  entry: './src/main.js',
  output: {
    library: 'MenuAim',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: 'menuAin.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
