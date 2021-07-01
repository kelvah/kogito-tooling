import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import "./DataTypeItem.scss";
interface DataTypeItemProps {
    dataType: DDDataField;
    index: number;
    editingIndex: number | undefined;
    onSave: (dataType: DDDataField, index: number | null) => void;
    onEdit?: (index: number, isChildren?: boolean) => void;
    onDelete?: (index: number) => void;
    onConstraintsSave: (dataType: DDDataField) => void;
    onValidate: (dataTypeName: string) => boolean;
    onOutsideClick: () => void;
}
declare const DataTypeItem: (props: DataTypeItemProps) => JSX.Element;
export default DataTypeItem;
//# sourceMappingURL=DataTypeItemReloaded.d.ts.map