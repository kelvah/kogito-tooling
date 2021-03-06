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

const nodeExternals = require("webpack-node-externals");
const { merge } = require("webpack-merge");
const common = require("../../webpack.common.config");

module.exports = (env, argv) => [
  merge(common(env, argv), {
    entry: {
      "bpmn/envelope/index": "./src/bpmn/envelope/index.ts",
      "bpmn/api/index": "./src/bpmn/api/index.ts",
      "dmn/envelope/index": "./src/dmn/envelope/index.ts",
      "dmn/api/index": "./src/dmn/api/index.ts",
      "scesim/envelope/index": "./src/scesim/envelope/index.ts",
      "scesim/api/index": "./src/scesim/api/index.ts",
    },
    output: {
      libraryTarget: "commonjs2",
    },
    externals: [nodeExternals({ modulesDir: "../../node_modules" })],
  }),
];
