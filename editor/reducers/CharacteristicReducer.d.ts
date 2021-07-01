import { ActionMap, Actions, AllActions } from "./Actions";
import { HistoryAwareReducer } from "../history";
import { Characteristic } from "@kogito-tooling/pmml-editor-marshaller";
interface CharacteristicPayload {
    [Actions.Scorecard_UpdateCharacteristic]: {
        readonly modelIndex: number;
        readonly characteristicIndex: number;
        readonly name: string;
        readonly reasonCode: string;
        readonly baselineScore: number;
    };
}
export declare type CharacteristicActions = ActionMap<CharacteristicPayload>[keyof ActionMap<CharacteristicPayload>];
export declare const CharacteristicReducer: HistoryAwareReducer<Characteristic[], AllActions>;
export {};
//# sourceMappingURL=CharacteristicReducer.d.ts.map