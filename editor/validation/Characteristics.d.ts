import { Characteristic, MiningField } from "@kogito-tooling/pmml-editor-marshaller";
import { ValidationRegistry } from "./ValidationRegistry";
export declare const validateCharacteristic: (modelIndex: number, scorecardProperties: {
    baselineScore: number | undefined;
    useReasonCodes: boolean | undefined;
}, characteristicIndex: number, characteristic: Characteristic, miningFields: MiningField[], validationRegistry: ValidationRegistry) => void;
export declare const validateCharacteristics: (modelIndex: number, scorecardProperties: {
    baselineScore: number | undefined;
    useReasonCodes: boolean | undefined;
}, characteristics: Characteristic[], miningFields: MiningField[], validationRegistry: ValidationRegistry) => void;
//# sourceMappingURL=Characteristics.d.ts.map