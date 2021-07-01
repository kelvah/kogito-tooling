import { FieldName, MiningSchema, Output, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
interface OutputsHandlerProps {
    modelIndex: number;
    output?: Output;
    miningSchema?: MiningSchema;
    validateOutputFieldName: (index: number | undefined, name: FieldName) => boolean;
    deleteOutputField: (index: number) => void;
    commitOutputField: (index: number | undefined, outputField: OutputField) => void;
}
export declare const OutputsHandler: (props: OutputsHandlerProps) => JSX.Element;
export {};
//# sourceMappingURL=OutputsHandler.d.ts.map