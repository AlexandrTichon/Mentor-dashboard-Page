const WebpackCleanPlugin = require('webpack-clean-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  devtool: 'source-map',
  entry: ['./src/app.js', './src/components/row/row.scss', './src/components/table/table.scss',
    './src/components/ceil/ceil.scss', './src/components/searchPanel/searchPanel.scss', './src/index.scss'],
  mode: 'development',
  module: {
    rules: [
      {
        test: /.(m?js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          },
        ),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 9999,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new WebpackCleanPlugin(['build']),
    new ExtractTextPlugin({
      filename: 'main.css',
    }),
  ],
  devServer: {
    contentBase: './src',
    hot: true,
    port: 3000 || 8080,
    historyApiFallback: true,
  },
};
