import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { FieldName, MiningSchema } from "@kogito-tooling/pmml-editor-marshaller";
interface MiningSchemaPayload {
    [Actions.AddMiningSchemaFields]: {
        readonly modelIndex: number;
        readonly names: FieldName[];
    };
    [Actions.DeleteMiningSchemaField]: {
        readonly modelIndex: number;
        readonly miningSchemaIndex: number;
        readonly name?: FieldName;
    };
}
export declare type MiningSchemaActions = ActionMap<MiningSchemaPayload>[keyof ActionMap<MiningSchemaPayload>];
export declare const MiningSchemaReducer: HistoryAwareValidatingReducer<MiningSchema, AllActions>;
export {};
//# sourceMappingURL=MiningSchemaReducer.d.ts.map