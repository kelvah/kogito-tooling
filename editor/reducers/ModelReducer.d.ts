import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { Model } from "@kogito-tooling/pmml-editor-marshaller";
interface ModelPayload {
    [Actions.DeleteModel]: {
        readonly modelIndex: number;
    };
}
export declare type ModelActions = ActionMap<ModelPayload>[keyof ActionMap<ModelPayload>];
export declare const ModelReducer: HistoryAwareValidatingReducer<Model[], AllActions>;
export {};
//# sourceMappingURL=ModelReducer.d.ts.map