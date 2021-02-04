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

import { Characteristic, Scorecard } from "@kogito-tooling/pmml-editor-marshaller";
import { ValidationService } from "./ValidationService";
import { ValidationEntry } from "./ValidationRegistry";
import { ValidationLevel } from "./ValidationLevel";

export const validateBaselineScore = (
  modelIndex: number,
  useReasonCodes: Scorecard["useReasonCodes"],
  baselineScore: Scorecard["baselineScore"],
  characteristics: Characteristic[],
  validation: ValidationService
) => {
  if (
    (useReasonCodes === undefined || useReasonCodes) &&
    baselineScore === undefined &&
    (characteristics.length === 0 ||
      characteristics.filter(characteristic => characteristic.baselineScore === undefined).length > 0)
  ) {
    validation.set(
      `models[${modelIndex}].baselineScore`,
      new ValidationEntry(ValidationLevel.WARNING, `Baseline score is required`)
    );
  }
};
