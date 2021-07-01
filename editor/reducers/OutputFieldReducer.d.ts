import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { OutputField } from "@kogito-tooling/pmml-editor-marshaller";
interface OutputFieldPayload {
    [Actions.UpdateOutput]: {
        readonly modelIndex: number;
        readonly outputIndex: number;
        readonly outputField: OutputField;
    };
}
export declare type OutputFieldActions = ActionMap<OutputFieldPayload>[keyof ActionMap<OutputFieldPayload>];
export declare const OutputFieldReducer: HistoryAwareValidatingReducer<OutputField[], AllActions>;
export {};
//# sourceMappingURL=OutputFieldReducer.d.ts.map