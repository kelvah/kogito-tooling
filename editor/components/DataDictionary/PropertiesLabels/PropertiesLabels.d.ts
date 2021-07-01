import "./PropertiesLabels.scss";
import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
interface PropertiesLabelsProps {
    dataType: DDDataField;
    editingIndex?: number;
    onPropertyDelete?: (dataType: DDDataField, index: number) => void;
}
declare const PropertiesLabels: (props: PropertiesLabelsProps) => JSX.Element;
export default PropertiesLabels;
//# sourceMappingURL=PropertiesLabels.d.ts.map