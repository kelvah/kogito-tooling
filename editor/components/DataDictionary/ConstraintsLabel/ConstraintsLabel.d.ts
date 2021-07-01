import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import "./ConstraintsLabel.scss";
interface ConstraintsLabelProps {
    dataType: DDDataField;
    dataTypeIndex: number;
    editMode?: boolean;
    onConstraintsDelete?: () => void;
}
declare const ConstraintsLabel: (props: ConstraintsLabelProps) => JSX.Element;
export default ConstraintsLabel;
//# sourceMappingURL=ConstraintsLabel.d.ts.map