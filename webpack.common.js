const path = require('path');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: "./app/main.jsx", // string | object | array
  entry: ["./app/main.jsx"
         ],
  // Here the application starts executing
  // and webpack starts bundling
  plugins: [
    // new CleanWebpackPlugin(['dist'])
    // new HtmlWebpackPlugin({
    //   title: 'Production'
    // })
  ],
  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: "bundle.js" // string
    // the filename template for entry chunks
  },

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include: /app/,
        exclude: /node_modules/,
        loader : 'babel-loader',
        query:
        {
          presets: ['env', 'react']
        }
      }
    ]
  },

  watch : true
}
