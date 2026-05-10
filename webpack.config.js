const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = (Plugin = require("mini-css-extract-plugin"));
module.exports = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "StaySafu",
      filename: "index.html",
      template: "./src/index.html",
    }),
    new HtmlWebpackPlugin({
      title: "StaySafu",
      filename: "internetSpeed.html",
      template: "./src/internetSpeed.html",
    }),
    new MiniCssExtractPlugin(),
  ],
};
