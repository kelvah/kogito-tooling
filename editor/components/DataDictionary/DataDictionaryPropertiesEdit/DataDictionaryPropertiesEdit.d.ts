import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import "./DataDictionaryPropertiesEdit.scss";
interface DataDictionaryPropertiesEditProps {
    dataType: DDDataField;
    dataFieldIndex: number | undefined;
    onClose: () => void;
    onSave: (payload: Partial<DDDataField>) => void;
}
declare const DataDictionaryPropertiesEdit: (props: DataDictionaryPropertiesEditProps) => JSX.Element;
export default DataDictionaryPropertiesEdit;
//# sourceMappingURL=DataDictionaryPropertiesEdit.d.ts.map