const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: ["@babel/polyfill", "./script.js"],
  output: {
    path: __dirname,
    filename: "build.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin("build.js")],
};
