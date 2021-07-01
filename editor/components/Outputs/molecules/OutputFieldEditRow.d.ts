import "./OutputFieldRow.scss";
import { FieldName, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
interface OutputFieldEditRowProps {
    modelIndex: number;
    outputField: OutputField;
    outputFieldIndex: number;
    validateOutputName: (name: FieldName) => boolean;
    viewExtendedProperties: () => void;
    onCommitAndClose: () => void;
    onCommit: (partial: Partial<OutputField>) => void;
    onCancel: () => void;
}
declare const OutputFieldEditRow: (props: OutputFieldEditRowProps) => JSX.Element;
export default OutputFieldEditRow;
//# sourceMappingURL=OutputFieldEditRow.d.ts.map