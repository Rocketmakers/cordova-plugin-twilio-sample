const fs = require("fs");
const path = require("path");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sourcePath = path.resolve("src");
const outputPath = path.resolve("cordova/www");

const getAppConfig = environment => {
  switch (environment) {
    case "dev":
      const ngrokBuiltFile = "../../ngrok.built.yml";
      if (fs.existsSync(ngrokBuiltFile)) {
        apiBaseUrl = `http://${process.env.USER}-api.rocketmakers.net.eu.ngrok.io`;
      } else {
        apiBaseUrl = "https://randomuser.me/api";
      }
      break;
    case "test":
      apiBaseUrl = "https://randomuser.me/api";
      break;
    case "prod":
      apiBaseUrl = "https://randomuser.me/api";
      break;
    default:
      throw new Error("unknown environment");
  }
  return {
    environment: JSON.stringify(environment),
    apiBaseUrl: JSON.stringify(apiBaseUrl)
  };
};

module.exports = ({ environment }) => {
  console.log("=================================");
  console.log(`ENVIRONMENT: ${environment}`);
  console.log("=================================");

  let mode = environment === "dev" ? "development" : "production";

  const config = {
    mode,
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: 4,
      })]
    },
    entry: {
      app: path.join(sourcePath, "index.tsx")
    },
    devServer: {
      contentBase: path.join(__dirname, 'cordva', 'www'),
      hot: false,
      writeToDisk: true
    },
    output: {
      filename: "[name].js",
      path: outputPath,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".scss"] // search for files ending with these extensions when importing
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader", // compile typescript
        },
        {
          test: /\.(jpg|ttf|svg|woff2?|eot|png|mp4|mp3)$/, // add extensions for new file types here
          use: {
            loader: "file-loader", // copy files to proxy and update paths to be absolute
            options: {
              name: "[name].[ext]",
              outputPath: 'assets/',
              publicPath: "assets"
            }
          }
        },
        {
          test: /\.s?css$/,
          use: [
            mode === "dev" ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader", // turn url() and @import calls into require
            {
              loader: "postcss-loader",
              options: {
                plugins: [require("autoprefixer")]
              }
            },
            "sass-loader" // compile sass
          ]
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "[name].css" }),
      new CopyWebpackPlugin([{ from: "src/assets/libraries", to: "libs" }]),
      new HtmlWebpackPlugin({
        title: `React web boilerplate${environment !== "production" ? ` - ${environment}` : ""}`,
        template: path.join(sourcePath, "index.html.ejs"),
        files: {
          js: ["[name].js"],
          css: ["[name].css"],
          chunks: {
            head: {
              css: "[name].css"
            },
            main: {
              entry: "[name].js"
            }
          },
          excludeChunks: mode === "development" ? ["head"] : []
        }
      }),
      new webpack.DefinePlugin({
        APP_CONFIG: JSON.stringify(getAppConfig(environment)),
        'process.env.NODE_ENV': JSON.stringify(mode)
      })
    ]
  }

  // dev  setup
  if (environment === "dev") {
    config.devtool = "eval";
  }

  return config
}