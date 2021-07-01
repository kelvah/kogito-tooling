import { Predicate } from "@kogito-tooling/pmml-editor-marshaller";
import "./AttributeEditor.scss";
interface AttributeEditorContent {
    partialScore?: number;
    reasonCode?: string;
    predicate?: Predicate;
}
interface AttributeEditorProps {
    modelIndex: number;
    characteristicIndex: number | undefined;
    attributeIndex: number | undefined;
    areReasonCodesUsed: boolean;
    onCancel: () => void;
    onCommit: (index: number | undefined, content: AttributeEditorContent) => void;
}
export declare const AttributeEditor: (props: AttributeEditorProps) => JSX.Element;
export {};
//# sourceMappingURL=AttributeEditor.d.ts.map