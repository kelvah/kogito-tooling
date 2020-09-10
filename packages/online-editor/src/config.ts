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

export const config = {
  development: {
    server: {
      backendUrl: "http://localhost:9002",
      projectName: "my-project",
      saveDirectory: "" // empty to save in the root path, or like src/main/resources/ (with ending "/").
    },
    openApi: {
      url: "http://localhost:8080",
      specPath: "/openapi"
    },
    publish: {
      url: "http://el-daas-workflow-kiegroup.apps-crc.testing",
      appName: "dmn-quarkus-example",
      envName: "kiegroup"
    }
  }
};