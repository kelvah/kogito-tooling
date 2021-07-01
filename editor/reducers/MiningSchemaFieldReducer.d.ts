import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { FieldName, InvalidValueTreatmentMethod, MiningField, MissingValueTreatmentMethod, OpType, OutlierTreatmentMethod, UsageType } from "@kogito-tooling/pmml-editor-marshaller";
interface MiningSchemaFieldPayload {
    [Actions.UpdateMiningSchemaField]: {
        readonly modelIndex: number;
        readonly miningSchemaIndex: number;
        readonly name: FieldName;
        readonly originalName: FieldName | undefined;
        readonly usageType: UsageType | undefined;
        readonly optype: OpType | undefined;
        readonly importance: number | undefined;
        readonly outliers: OutlierTreatmentMethod | undefined;
        readonly lowValue: number | undefined;
        readonly highValue: number | undefined;
        readonly missingValueTreatment: MissingValueTreatmentMethod | undefined;
        readonly missingValueReplacement: any | undefined;
        readonly invalidValueTreatment: InvalidValueTreatmentMethod | undefined;
        readonly invalidValueReplacement: any | undefined;
    };
}
export declare type MiningSchemaFieldActions = ActionMap<MiningSchemaFieldPayload>[keyof ActionMap<MiningSchemaFieldPayload>];
export declare const MiningSchemaFieldReducer: HistoryAwareValidatingReducer<MiningField[], AllActions>;
export {};
//# sourceMappingURL=MiningSchemaFieldReducer.d.ts.map