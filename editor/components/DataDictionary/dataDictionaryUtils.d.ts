import { DataDictionary, DataField } from "@kogito-tooling/pmml-editor-marshaller";
import { DDDataField } from "./DataDictionaryContainer/DataDictionaryContainer";
export declare const convertPMML2DD: (PMMLDataDictionary: DataDictionary | undefined) => DDDataField[];
export declare const convertToDataField: (item: DDDataField) => DataField;
export declare const convertFromDataField: (item: DataField) => DDDataField;
export declare const getPathsString: (path: Array<number>) => string;
export declare const getParentPathString: (path: Array<number>) => string;
export declare const getChildPathString: (path: Array<number>, childIndex: number) => string;
export declare const isStructureOrCustomType: (type: DDDataField["type"]) => boolean;
//# sourceMappingURL=dataDictionaryUtils.d.ts.map