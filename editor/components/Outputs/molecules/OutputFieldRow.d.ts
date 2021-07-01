import { OutputField } from "@kogito-tooling/pmml-editor-marshaller";
import "./OutputFieldRow.scss";
interface OutputFieldRowProps {
    modelIndex: number;
    outputFieldIndex: number;
    outputField: OutputField | undefined;
    onEditOutputField: () => void;
    onDeleteOutputField: () => void;
}
declare const OutputFieldRow: (props: OutputFieldRowProps) => JSX.Element;
export default OutputFieldRow;
//# sourceMappingURL=OutputFieldRow.d.ts.map