import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { DataDictionary, DataType, FieldName, OpType } from "@kogito-tooling/pmml-editor-marshaller";
interface DataDictionaryPayload {
    [Actions.AddDataDictionaryField]: {
        readonly modelIndex?: number;
        readonly name?: string;
        readonly type: DataType;
        readonly optype: OpType;
    };
    [Actions.DeleteDataDictionaryField]: {
        readonly modelIndex?: number;
        readonly index: number;
    };
    [Actions.AddBatchDataDictionaryFields]: {
        readonly modelIndex?: number;
        readonly dataDictionaryFields: FieldName[];
    };
    [Actions.ReorderDataDictionaryFields]: {
        readonly oldIndex: number;
        readonly newIndex: number;
    };
}
export declare type DataDictionaryActions = ActionMap<DataDictionaryPayload>[keyof ActionMap<DataDictionaryPayload>];
export declare const DataDictionaryReducer: HistoryAwareValidatingReducer<DataDictionary, AllActions>;
export {};
//# sourceMappingURL=DataDictionaryReducer.d.ts.map