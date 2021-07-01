import { ActionMap, Actions } from "./Actions";
import { HistoryAwareValidatingReducer } from "../history";
import { DataField, FieldName } from "@kogito-tooling/pmml-editor-marshaller";
interface DataDictionaryFieldPayload {
    [Actions.UpdateDataDictionaryField]: {
        readonly modelIndex?: number;
        readonly dataDictionaryIndex: number;
        readonly dataField: DataField;
        readonly originalName: FieldName;
    };
}
export declare type DataDictionaryFieldActions = ActionMap<DataDictionaryFieldPayload>[keyof ActionMap<DataDictionaryFieldPayload>];
export declare const DataDictionaryFieldReducer: HistoryAwareValidatingReducer<DataField[], DataDictionaryFieldActions>;
export {};
//# sourceMappingURL=DataDictionaryFieldReducer.d.ts.map