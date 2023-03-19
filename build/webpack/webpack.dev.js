const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./client/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../../public", "dist"),
  },
  plugins: [
    //Will automatically attach the bundle to the index.html
    new HtmlWebpackPlugin({
      title: "Helsinki City Bike",
      filename: "../index.html",
      template: "client/assets/index.html",
    }),
  ],
}
