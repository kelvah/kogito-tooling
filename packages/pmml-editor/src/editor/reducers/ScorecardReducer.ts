/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
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
import { ActionMap, Actions } from "./Actions";
import { HistoryAwareReducer, HistoryService } from "../history";
import { BaselineMethod, MiningFunction, ReasonCodeAlgorithm, Scorecard } from "@kogito-tooling/pmml-editor-marshaller";
import { Reducer } from "react";
import { immerable } from "immer";

// @ts-ignore
Scorecard[immerable] = true;

interface ScorecardPayload {
  [Actions.Scorecard_SetCoreProperties]: {
    readonly index: number;
    readonly isScorable: boolean;
    readonly functionName: MiningFunction;
    readonly baselineScore: number;
    readonly baselineMethod: BaselineMethod;
    readonly initialScore: number;
    readonly useReasonCodes: boolean;
    readonly reasonCodeAlgorithm: ReasonCodeAlgorithm;
  };
}

export type ScorecardActions = ActionMap<ScorecardPayload>[keyof ActionMap<ScorecardPayload>];

export const ScorecardReducer: HistoryAwareReducer<Scorecard, ScorecardActions> = (
  service: HistoryService
): Reducer<Scorecard, ScorecardActions> => {
  return (state: Scorecard, action: ScorecardActions) => {
    switch (action.type) {
      case Actions.Scorecard_SetCoreProperties:
        return service.mutate(state, `models[${action.payload.index}]`, draft => {
          draft.isScorable = action.payload.isScorable;
          draft.functionName = action.payload.functionName;
          draft.baselineScore = action.payload.baselineScore;
          draft.baselineMethod = action.payload.baselineMethod;
          draft.initialScore = action.payload.initialScore;
          draft.useReasonCodes = action.payload.useReasonCodes;
          draft.reasonCodeAlgorithm = action.payload.reasonCodeAlgorithm;
        });
    }

    return state;
  };
};