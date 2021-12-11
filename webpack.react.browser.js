const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
const CopyPlugin = require("copy-webpack-plugin");

const rootPath = path.resolve(__dirname, ".");

module.exports = () => {
  // replace process.env.*
  const env = dotenv.config().parsed;
  const envKeys = {};
  if (env) {
    Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, envKeys);
  } else {
    const keys = ["SERVER_URL"];
    keys.forEach((k) => {
      envKeys[`process.env.${k}`] = JSON.stringify(process.env[k]);
    });
  }

  return {
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      mainFields: ["main", "module", "browser"],
      fallback: {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        util: false,
        tty: false,
      },
    },
    entry: path.resolve(rootPath, "src", "index.tsx"),
    target: "web",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.(png|svg|jpg|gif|eot|ttf|woff|woff2)$/,
          loader: "url-loader",
          options: {
            publicPath: "./",
            limit: 10000,
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    devServer: {
      contentBase: path.join(rootPath, "dist"),
      historyApiFallback: true,
      compress: true,
      hot: true,
      host: "0.0.0.0",
      port: 3000,
      publicPath: "/",
      https: true,
    },
    output: {
      path: path.resolve(rootPath, "dist"),
      filename: "js/[name].[contenthash].js",
      publicPath: "./",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./assets/index.html",
      }),
      new webpack.DefinePlugin(envKeys),
      // new webpack.ProvidePlugin({
      //   process: "process/browser",
      // }),
      new CopyPlugin({ patterns: [{ from: "assets", to: "assets" }] }),
    ],
  };
};
