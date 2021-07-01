import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { PMML } from "@kogito-tooling/pmml-editor-marshaller";
interface PMMLPayload {
    [Actions.Refresh]: {
        readonly pmml: PMML;
    };
    [Actions.Validate]: {
        readonly modelIndex?: number;
    };
    [Actions.SetVersion]: {
        readonly version: string;
    };
}
export declare type VersionActions = ActionMap<PMMLPayload>[keyof ActionMap<PMMLPayload>];
interface StateControlPayload {
    [Actions.Undo]: undefined;
    [Actions.Redo]: undefined;
}
export declare type StateControlActions = ActionMap<StateControlPayload>[keyof ActionMap<StateControlPayload>];
export declare const PMMLReducer: HistoryAwareValidatingReducer<PMML, AllActions>;
export {};
//# sourceMappingURL=PMMLReducer.d.ts.map