import * as React from "react";
import "./MiningSchemaContainer.scss";
import { DataDictionary, FieldName, MiningField, MiningSchema } from "@kogito-tooling/pmml-editor-marshaller";
interface MiningSchemaContainerProps {
    modelIndex: number;
    dataDictionary?: DataDictionary;
    miningSchema?: MiningSchema;
    onAddField: (name: string[]) => void;
    onDeleteField: (index: number) => void;
    onUpdateField: (index: number, originalName: FieldName | undefined, field: MiningField) => void;
}
declare const MiningSchemaContainer: (props: MiningSchemaContainerProps) => JSX.Element;
export default MiningSchemaContainer;
export declare const MiningSchemaContext: React.Context<number>;
export interface MiningSchemaOption {
    name: string;
    isSelected: boolean;
}
//# sourceMappingURL=MiningSchemaContainer.d.ts.map