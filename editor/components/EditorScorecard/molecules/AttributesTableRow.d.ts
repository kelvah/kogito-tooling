import { Attribute, Characteristic, DataField, MiningField } from "@kogito-tooling/pmml-editor-marshaller";
import "./AttributesTableRow.scss";
interface AttributesTableRowProps {
    modelIndex: number;
    characteristicIndex: number;
    characteristic: Characteristic;
    attributeIndex: number;
    attribute: Attribute;
    areReasonCodesUsed: boolean;
    characteristicReasonCode: Characteristic["reasonCode"];
    dataFields: DataField[];
    miningFields: MiningField[];
    onEdit: () => void;
    onDelete: () => void;
    onCommit: (partial: Partial<Attribute>) => void;
}
export declare const AttributesTableRow: (props: AttributesTableRowProps) => JSX.Element;
export {};
//# sourceMappingURL=AttributesTableRow.d.ts.map