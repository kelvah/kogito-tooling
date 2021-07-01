import "./ConstraintsEnumEdit.scss";
interface ConstraintsEnumEditProps {
    dataFieldIndex: number | undefined;
    enumerations: string[];
    onAdd: () => void;
    onChange: (value: string, index: number) => void;
    onDelete: (index: number) => void;
    onSort: (oldIndex: number, newIndex: number) => void;
}
declare const ConstraintsEnumEdit: (props: ConstraintsEnumEditProps) => JSX.Element;
export default ConstraintsEnumEdit;
//# sourceMappingURL=ConstraintsEnumEdit.d.ts.map