// UglifyJsPluginなどのプラグインを利用するためにwebpackを読み込んでおく必要がある。
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
  // エントリーポイントの設定
  entry: './src/js/index.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'customize.min.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, 'public_html/assets/js')
  },
  // ローダーの設定
  module: {
    rules: [{
      // ローダーの処理対象ファイル
      test: /\.js$/,
      // ローダーの処理対象から外すディレクトリ
      exclude: /node_modules/,
      use: {
        // 利用するローダー
        loader: 'babel-loader',
        // ローダーのオプション
        options: {
          presets: ['@babel/preset-env']
        }
      },
    }],
  },
  // プラグインの設定
  plugins: [
    new ESLintPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
};