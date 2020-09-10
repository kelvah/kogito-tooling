/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  target: "node",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  stats: {
    excludeAssets: [name => !name.endsWith(".js"), /gwt-editors\/.*/, /editors\/.*/],
    excludeModules: true
  },
  performance: {
    maxAssetSize: 30000000,
    maxEntrypointSize: 30000000
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: [path.resolve("./node_modules"), path.resolve("./src")]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },
  output: {
    libraryTarget: "commonjs2",
  },
  externals: [nodeExternals({ modulesDir: "./node_modules" })]
};