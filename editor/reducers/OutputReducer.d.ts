import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { FieldName, Output, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
interface OutputPayload {
    [Actions.AddOutput]: {
        readonly modelIndex: number;
        readonly outputField: OutputField;
    };
    [Actions.DeleteOutput]: {
        readonly modelIndex: number;
        readonly outputIndex: number;
    };
    [Actions.AddBatchOutputs]: {
        readonly modelIndex: number;
        readonly outputFields: FieldName[];
    };
}
export declare type OutputActions = ActionMap<OutputPayload>[keyof ActionMap<OutputPayload>];
export declare const OutputReducer: HistoryAwareValidatingReducer<Output, AllActions>;
export {};
//# sourceMappingURL=OutputReducer.d.ts.map