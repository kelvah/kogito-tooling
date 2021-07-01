import { MiningField } from "@kogito-tooling/pmml-editor-marshaller";
import "./MiningSchemaFieldLabels.scss";
interface MiningSchemaFieldLabelsProps {
    index: number;
    modelIndex: number;
    field: MiningField;
    onEdit: () => void;
    onDelete: (updatedField: MiningField) => void;
    editing: boolean;
}
declare const MiningSchemaFieldLabels: (props: MiningSchemaFieldLabelsProps) => JSX.Element;
export default MiningSchemaFieldLabels;
//# sourceMappingURL=MiningSchemaFieldLabels.d.ts.map