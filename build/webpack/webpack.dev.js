const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  entry: "./src/client/index.tsx",
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          // The order of these loaders is important!
          // They will be applied in reverse order (i.e. from right to left)
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        //Ensure leaflet images are loaded bu adding them to the root level of the public folder
        test: /\.png$/,
        loader: "file-loader",
        options: {
          outputPath: "../",
          name: "[name].[ext]",
        },
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
      outputPath: "../",
      filename: "index.html",
      template: "./src/client/assets/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
}
