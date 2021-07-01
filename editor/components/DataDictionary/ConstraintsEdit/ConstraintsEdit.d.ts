import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import "./ConstraintsEdit.scss";
interface ConstraintsEditProps {
    dataType: DDDataField;
    dataFieldIndex: number | undefined;
    onSave: (payload: Partial<DDDataField>) => void;
}
declare const ConstraintsEdit: (props: ConstraintsEditProps) => JSX.Element;
export default ConstraintsEdit;
//# sourceMappingURL=ConstraintsEdit.d.ts.map