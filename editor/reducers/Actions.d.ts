import { StateControlActions, VersionActions } from "./PMMLReducer";
import { DataDictionaryActions } from "./DataDictionaryReducer";
import { DataDictionaryFieldActions } from "./DataDictionaryFieldReducer";
import { HeaderActions } from "./HeaderReducer";
import { ModelActions } from "./ModelReducer";
import { ScorecardActions } from "./ScorecardReducer";
import { CharacteristicsActions } from "./CharacteristicsReducer";
import { CharacteristicActions } from "./CharacteristicReducer";
import { AttributesActions } from "./AttributesReducer";
import { OutputActions } from "./OutputReducer";
import { OutputFieldActions } from "./OutputFieldReducer";
import { MiningSchemaActions } from "./MiningSchemaReducer";
import { MiningSchemaFieldActions } from "./MiningSchemaFieldReducer";
export declare type ActionMap<M extends {
    [index: string]: any;
}> = {
    [Key in keyof M]: M[Key] extends undefined ? {
        type: Key;
        payload: undefined;
    } : {
        type: Key;
        payload: M[Key];
    };
};
export declare enum Actions {
    Refresh = "REFRESH",
    Validate = "VALIDATE",
    SetVersion = "SET_VERSION",
    DeleteModel = "DELETE_MODEL",
    AddDataDictionaryField = "DATA_DICTIONARY_ADD_FIELD",
    AddBatchDataDictionaryFields = "DATA_DICTIONARY_BATCH_ADD",
    DeleteDataDictionaryField = "DATA_DICTIONARY_DELETE_FIELD",
    UpdateDataDictionaryField = "DATA_DICTIONARY_UPDATE_FIELD",
    ReorderDataDictionaryFields = "DATA_DICTIONARY_REORDER_FIELDS",
    SetHeaderDescription = "SET_HEADER_DESCRIPTION",
    AddOutput = "OUTPUT_ADD",
    AddBatchOutputs = "OUTPUT_BATCH_ADD",
    UpdateOutput = "OUTPUT_UPDATE",
    DeleteOutput = "OUTPUT_DELETE",
    AddMiningSchemaFields = "MINING_SCHEMA_ADD",
    DeleteMiningSchemaField = "MINING_SCHEMA_DELETE",
    UpdateMiningSchemaField = "MINING_SCHEMA_UPDATE",
    Undo = "UNDO",
    Redo = "REDO",
    Scorecard_SetModelName = "SCORECARD_SET_MODEL_NAME",
    Scorecard_SetCoreProperties = "SCORECARD_SET_CORE_PROPERTIES",
    Scorecard_AddCharacteristic = "SCORECARD_ADD_CHARACTERISTIC",
    Scorecard_DeleteCharacteristic = "SCORECARD_DELETE_CHARACTERISTIC",
    Scorecard_UpdateCharacteristic = "SCORECARD_UPDATE_CHARACTERISTIC",
    Scorecard_AddAttribute = "SCORECARD_ADD_ATTRIBUTE",
    Scorecard_DeleteAttribute = "SCORECARD_DELETE_ATTRIBUTE",
    Scorecard_UpdateAttribute = "SCORECARD_UPDATE_ATTRIBUTE"
}
export declare type AllActions = StateControlActions | VersionActions | HeaderActions | MiningSchemaActions | MiningSchemaFieldActions | DataDictionaryActions | DataDictionaryFieldActions | ModelActions | ScorecardActions | CharacteristicsActions | CharacteristicActions | AttributesActions | OutputActions | OutputFieldActions;
//# sourceMappingURL=Actions.d.ts.map