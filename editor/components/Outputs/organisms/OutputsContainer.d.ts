import { FieldName, MiningSchema, Output, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
import "./OutputsContainer.scss";
interface OutputsContainerProps {
    modelIndex: number;
    output?: Output;
    miningSchema?: MiningSchema;
    validateOutputFieldName: (index: number | undefined, name: FieldName) => boolean;
    deleteOutputField: (index: number) => void;
    commitOutputField: (index: number | undefined, outputField: OutputField) => void;
}
export declare const OutputsContainer: (props: OutputsContainerProps) => JSX.Element;
export {};
//# sourceMappingURL=OutputsContainer.d.ts.map