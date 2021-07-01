import { RangeConstraint } from "../DataDictionaryContainer/DataDictionaryContainer";
import "./ConstraintsRangeEdit.scss";
interface ConstraintsRangeEditProps {
    dataFieldIndex: number | undefined;
    ranges: RangeConstraint[];
    onAdd: () => void;
    onChange: (ranges: RangeConstraint[]) => void;
    onDelete: (index: number) => void;
    countLimit?: number;
}
declare const ConstraintsRangeEdit: (props: ConstraintsRangeEditProps) => JSX.Element;
export default ConstraintsRangeEdit;
//# sourceMappingURL=ConstraintsRangeEdit.d.ts.map