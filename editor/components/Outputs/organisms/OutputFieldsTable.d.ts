import { FieldName, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
import "./OutputFieldsTable.scss";
interface OutputFieldsTableProps {
    modelIndex: number;
    outputs: OutputField[];
    selectedOutputIndex: number | undefined;
    setSelectedOutputIndex: (index: number | undefined) => void;
    validateOutputFieldName: (index: number | undefined, name: FieldName) => boolean;
    viewExtendedProperties: () => void;
    onAddOutputField: () => void;
    onDeleteOutputField: (index: number) => void;
    onCommitAndClose: () => void;
    onCommit: (partial: Partial<OutputField>) => void;
    onCancel: () => void;
}
declare const OutputFieldsTable: (props: OutputFieldsTableProps) => JSX.Element;
export default OutputFieldsTable;
//# sourceMappingURL=OutputFieldsTable.d.ts.map