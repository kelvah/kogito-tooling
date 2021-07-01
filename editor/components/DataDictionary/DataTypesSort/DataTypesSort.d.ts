import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import "./DataTypesSort.scss";
interface DataTypesSortProps {
    dataTypes: DDDataField[];
    onReorder: (oldIndex: number, newIndex: number) => void;
}
declare const DataTypesSort: ({ dataTypes, onReorder }: DataTypesSortProps) => JSX.Element;
export default DataTypesSort;
//# sourceMappingURL=DataTypesSort.d.ts.map