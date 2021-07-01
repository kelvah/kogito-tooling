import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareReducer } from "../history";
import { Characteristics } from "@kogito-tooling/pmml-editor-marshaller";
interface CharacteristicsPayload {
    [Actions.Scorecard_AddCharacteristic]: {
        readonly modelIndex: number;
        readonly name: string;
        readonly reasonCode: string;
        readonly baselineScore: number;
    };
    [Actions.Scorecard_DeleteCharacteristic]: {
        readonly modelIndex: number;
        readonly characteristicIndex: number;
    };
}
export declare type CharacteristicsActions = ActionMap<CharacteristicsPayload>[keyof ActionMap<CharacteristicsPayload>];
export declare const CharacteristicsReducer: HistoryAwareReducer<Characteristics, AllActions>;
export {};
//# sourceMappingURL=CharacteristicsReducer.d.ts.map