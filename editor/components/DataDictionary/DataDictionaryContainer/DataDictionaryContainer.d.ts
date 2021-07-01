import "./DataDictionaryContainer.scss";
interface DataDictionaryContainerProps {
    dataDictionary: DDDataField[];
    onAdd: (name: string, type: DDDataField["type"], optype: DDDataField["optype"], index?: number) => void;
    onEdit: (index: number, originalName: string, field: DDDataField) => void;
    onDelete: (index: number) => void;
    onReorder: (oldIndex: number, newIndex: number) => void;
    onBatchAdd: (fields: string[]) => void;
    onEditingPhaseChange: (status: boolean) => void;
}
declare const DataDictionaryContainer: (props: DataDictionaryContainerProps) => JSX.Element;
export default DataDictionaryContainer;
export interface DDDataField {
    name: string;
    type: "string" | "integer" | "float" | "double" | "boolean" | "structure";
    optype: "categorical" | "ordinal" | "continuous";
    constraints?: Constraints;
    displayName?: string;
    isCyclic?: boolean;
    missingValue?: string;
    invalidValue?: string;
    children?: DDDataField[];
}
export declare type Constraints = {
    type: ConstraintType.RANGE;
    value: RangeConstraint[];
} | {
    type: ConstraintType.ENUMERATION;
    value: string[];
};
export interface RangeConstraint {
    start: {
        value: string;
        included: boolean;
    };
    end: {
        value: string;
        included: boolean;
    };
}
export declare enum ConstraintType {
    RANGE = "Range",
    ENUMERATION = "Enumeration",
    NONE = ""
}
//# sourceMappingURL=DataDictionaryContainer.d.ts.map