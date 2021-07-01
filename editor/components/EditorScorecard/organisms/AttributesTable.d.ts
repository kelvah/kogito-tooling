import { Attribute, Characteristic } from "@kogito-tooling/pmml-editor-marshaller";
import "./AttributesTable.scss";
interface AttributesTableProps {
    modelIndex: number;
    characteristicIndex: number;
    characteristic: Characteristic;
    areReasonCodesUsed: boolean;
    viewAttribute: (index: number | undefined) => void;
    deleteAttribute: (index: number) => void;
    onCommit: (index: number, partial: Partial<Attribute>) => void;
}
export declare const AttributesTable: (props: AttributesTableProps) => JSX.Element;
export {};
//# sourceMappingURL=AttributesTable.d.ts.map