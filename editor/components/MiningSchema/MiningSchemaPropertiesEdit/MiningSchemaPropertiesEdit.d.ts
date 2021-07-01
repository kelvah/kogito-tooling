import { MiningField } from "@kogito-tooling/pmml-editor-marshaller";
import "./MiningSchemaPropertiesEdit.scss";
interface MiningSchemaPropertiesEditProps {
    modelIndex: number;
    miningFieldIndex: number;
    field: MiningField;
    onSave: (field: MiningField) => void;
    onClose: () => void;
}
declare const MiningSchemaPropertiesEdit: ({ modelIndex, miningFieldIndex, field, onSave, onClose, }: MiningSchemaPropertiesEditProps) => JSX.Element;
export default MiningSchemaPropertiesEdit;
//# sourceMappingURL=MiningSchemaPropertiesEdit.d.ts.map