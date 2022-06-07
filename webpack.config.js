const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './src/main.js'), //入口，表示要使用webpack打包哪个文件
  output: {
    path: path.join(__dirname, './dist'), //指定打包好的文件，输出到哪个目录中去
    filename: 'bundle.js', //这是指定 输出的文件的名称
    publicPath: '/'
  },
  devServer: {
    port: 7001
    //指定服务器自动打包哪个文件夹下的文件
    // contentBase: './dist'
    //默认publicPath:'/'，输出文件，即bundle.js文件存于服务器的根目录中，此处也可更改存储路径
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vs}fs|vert|frag)$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './public/index.html'
    })
  ]
}
