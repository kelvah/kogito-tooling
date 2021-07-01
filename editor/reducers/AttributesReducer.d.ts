import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareReducer } from "../history";
import { Attribute, Predicate } from "@kogito-tooling/pmml-editor-marshaller";
interface AttributesPayload {
    [Actions.Scorecard_AddAttribute]: {
        readonly modelIndex: number;
        readonly characteristicIndex: number;
        readonly predicate: Predicate;
        readonly partialScore: number;
        readonly reasonCode: string;
    };
    [Actions.Scorecard_DeleteAttribute]: {
        readonly modelIndex: number;
        readonly characteristicIndex: number;
        readonly attributeIndex: number;
    };
    [Actions.Scorecard_UpdateAttribute]: {
        readonly modelIndex: number;
        readonly characteristicIndex: number;
        readonly attributeIndex: number;
        readonly predicate: Predicate;
        readonly partialScore: number;
        readonly reasonCode: string;
    };
}
export declare type AttributesActions = ActionMap<AttributesPayload>[keyof ActionMap<AttributesPayload>];
export declare const AttributesReducer: HistoryAwareReducer<Attribute[], AllActions>;
export {};
//# sourceMappingURL=AttributesReducer.d.ts.map