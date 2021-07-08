import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import "./DataDictionaryPropertiesEdit.scss";
interface DataDictionaryPropertiesEditProps {
    dataType: DDDataField;
    dataFieldIndex: number | undefined;
    onClose: () => void;
    onSave: (payload: Partial<DDDataField>) => void;
    structureTypes: string[];
    goToCustomType: (name: string) => void;
}
declare const DataDictionaryPropertiesEdit: (props: DataDictionaryPropertiesEditProps) => JSX.Element;
export default DataDictionaryPropertiesEdit;
//# sourceMappingURL=DataDictionaryPropertiesEdit.d.ts.map