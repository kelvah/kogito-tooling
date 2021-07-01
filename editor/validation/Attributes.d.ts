import { Attribute, Characteristic, MiningField } from "@kogito-tooling/pmml-editor-marshaller";
import { ValidationRegistry } from "./ValidationRegistry";
export declare const validateAttribute: (modelIndex: number, scorecardProperties: {
    baselineScore: number | undefined;
    useReasonCodes: boolean | undefined;
}, characteristicIndex: number, characteristic: Characteristic, isPartialScoreRequired: boolean, attributeIndex: number, attribute: Attribute, miningFields: MiningField[], validationRegistry: ValidationRegistry) => void;
export declare const validateAttributes: (modelIndex: number, scorecardProperties: {
    baselineScore: number | undefined;
    useReasonCodes: boolean | undefined;
}, characteristicIndex: number, characteristic: Characteristic, miningFields: MiningField[], validationRegistry: ValidationRegistry) => void;
export declare const areAttributesReasonCodesMissing: (attributes: Attribute[]) => boolean;
//# sourceMappingURL=Attributes.d.ts.map