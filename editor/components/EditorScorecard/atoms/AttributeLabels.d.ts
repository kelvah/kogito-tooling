import { Attribute, Characteristic } from "@kogito-tooling/pmml-editor-marshaller";
interface AttributeLabelsProps {
    modelIndex: number;
    characteristic: Characteristic;
    characteristicIndex: number;
    activeAttributeIndex: number;
    activeAttribute: Attribute;
    areReasonCodesUsed: boolean;
    characteristicReasonCode: Characteristic["reasonCode"];
    commit?: (partial: Partial<Attribute>) => void;
}
export declare const AttributeLabels: (props: AttributeLabelsProps) => JSX.Element;
export {};
//# sourceMappingURL=AttributeLabels.d.ts.map