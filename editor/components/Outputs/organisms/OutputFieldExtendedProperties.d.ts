import { OutputField } from "@kogito-tooling/pmml-editor-marshaller";
interface OutputFieldExtendedPropertiesProps {
    modelIndex: number;
    activeOutputFieldIndex?: number;
    activeOutputField: OutputField | undefined;
    targetFields: string[];
    commit: (outputField: Partial<OutputField>) => void;
}
export declare const OutputFieldExtendedProperties: (props: OutputFieldExtendedPropertiesProps) => JSX.Element;
export {};
//# sourceMappingURL=OutputFieldExtendedProperties.d.ts.map