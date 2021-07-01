import { DataDictionary, DataField } from "@kogito-tooling/pmml-editor-marshaller";
import { DDDataField } from "./DataDictionaryContainer/DataDictionaryContainer";
export declare const convertPMML2DD: (PMMLDataDictionary: DataDictionary | undefined) => DDDataField[];
export declare const convertToDataField: (item: DDDataField) => DataField;
export declare const convertFromDataField: (item: DataField) => DDDataField;
//# sourceMappingURL=dataDictionaryUtils.d.ts.map