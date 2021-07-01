import { MiningField, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
import { ValidationRegistry } from "./ValidationRegistry";
export declare const validateOutputs: (modelIndex: number, outputFields: OutputField[], miningFields: MiningField[], validationRegistry: ValidationRegistry) => void;
export declare const validateOutput: (modelIndex: number, outputField: OutputField, outputFieldIndex: number, miningFields: MiningField[], validationRegistry: ValidationRegistry) => void;
export declare const isOutputsTargetFieldRequired: (miningFields: MiningField[]) => boolean;
//# sourceMappingURL=Outputs.d.ts.map