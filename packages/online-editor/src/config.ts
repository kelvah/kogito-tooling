/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// @ts-nocheck
const jitDmnUrl = window.JITDMN_URL || process.env.JITDMN_URL;

// @ts-nocheck
export const config = {
  baaasBaseUrl: window.BAAAS_BASE_URL || process.env.BAAAS_BASE_URL,
  kafkaOptions: (window.BAAAS_KAFKA_OPTIONS || process.env.BAAAS_KAFKA_OPTIONS) as string[],
  jitDmnUrl,
  testFeatureOnly: !!jitDmnUrl
};
