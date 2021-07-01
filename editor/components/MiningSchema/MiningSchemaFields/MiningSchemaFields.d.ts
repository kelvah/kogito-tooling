import { DataDictionary, MiningField } from "@kogito-tooling/pmml-editor-marshaller";
import "./MiningSchemaFields.scss";
interface MiningSchemaFieldsProps {
    modelIndex: number;
    dataDictionary?: DataDictionary;
    fields: MiningField[] | undefined;
    onAddProperties: (index: number) => void;
    onDelete: (index: number, name: string) => void;
    onPropertyDelete: (index: number, updatedField: MiningField) => void;
    onEdit: (index: number) => void;
    onCancel: () => void;
}
declare const MiningSchemaFields: (props: MiningSchemaFieldsProps) => JSX.Element;
export default MiningSchemaFields;
//# sourceMappingURL=MiningSchemaFields.d.ts.map