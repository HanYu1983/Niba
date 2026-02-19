const path = require('path');
const webpack = require('webpack');

const is_production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: is_production ? 'production' : 'development',
  optimization: {
    minimize: is_production,
    minimizer: [
      new (require('terser-webpack-plugin'))({
        terserOptions: {
          compress: {
            drop_console: true, // 移除 console.log
            drop_debugger: true, // 移除 debugger
          },
          mangle: true, // 混淆變數名
        },
      }),
    ],
  },
  // https://webpack.js.org/plugins/limit-chunk-count-plugin/
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(gif|glb|atlas|skel|avif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 1024 * 10, // 10MB
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|mp4|webp|webm)$/i,
        use: [
          {
            // 使用絕對路徑引用本地的 Loader 檔案
            loader: path.resolve(__dirname, 'loaders/base32768-loader.mjs'),
          },
        ],
      },
    ],
  },
};