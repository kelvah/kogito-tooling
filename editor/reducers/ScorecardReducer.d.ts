import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { BaselineMethod, MiningFunction, ReasonCodeAlgorithm, Scorecard } from "@kogito-tooling/pmml-editor-marshaller";
import { CharacteristicsActions } from "./CharacteristicsReducer";
import { CharacteristicActions } from "./CharacteristicReducer";
import { AttributesActions } from "./AttributesReducer";
interface ScorecardPayload {
    [Actions.Scorecard_SetModelName]: {
        readonly modelIndex: number;
        readonly modelName: string;
    };
    [Actions.Scorecard_SetCoreProperties]: {
        readonly modelIndex: number;
        readonly modelName: string;
        readonly isScorable: boolean;
        readonly functionName: MiningFunction;
        readonly algorithmName: string;
        readonly baselineScore: number;
        readonly baselineMethod: BaselineMethod;
        readonly initialScore: number;
        readonly useReasonCodes: boolean;
        readonly reasonCodeAlgorithm: ReasonCodeAlgorithm;
    };
}
export declare type ScorecardActions = ActionMap<ScorecardPayload>[keyof ActionMap<ScorecardPayload>];
export declare type AllScorecardActions = ScorecardActions | CharacteristicsActions | CharacteristicActions | AttributesActions;
export declare const ScorecardReducer: HistoryAwareValidatingReducer<Scorecard, AllActions>;
export {};
//# sourceMappingURL=ScorecardReducer.d.ts.map