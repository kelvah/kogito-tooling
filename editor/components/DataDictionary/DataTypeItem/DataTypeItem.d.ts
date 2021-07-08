import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import { Interaction } from "../../../types";
import "./DataTypeItem.scss";
interface DataTypeItemProps {
    dataType: DDDataField;
    index: number;
    editingIndex: number | undefined;
    onSave: (dataType: DDDataField, index: number | null) => void;
    onEdit?: (index: number, path?: number) => void;
    onDelete?: (index: number, interaction: Interaction) => void;
    onConstraintsSave: (dataType: DDDataField) => void;
    onValidate: (dataTypeName: string) => boolean;
    onOutsideClick: () => void;
    getCustomTypeDefinition: (name: string) => DDDataField | undefined;
}
declare const DataTypeItem: (props: DataTypeItemProps) => JSX.Element;
export default DataTypeItem;
//# sourceMappingURL=DataTypeItem.d.ts.map