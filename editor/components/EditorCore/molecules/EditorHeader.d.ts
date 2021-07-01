import { FieldName, MiningSchema, Output, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
import "./EditorHeader.scss";
interface EditorHeaderViewerProps {
    modelName: string;
    modelIndex: number;
}
interface EditorHeaderEditorProps extends EditorHeaderViewerProps {
    output?: Output;
    miningSchema?: MiningSchema;
    validateOutputFieldName: (index: number | undefined, name: FieldName) => boolean;
    deleteOutputField: (index: number) => void;
    commitOutputField: (index: number | undefined, outputField: OutputField) => void;
    commitModelName: (modelName: string) => void;
}
declare type EditorHeaderProps = EditorHeaderViewerProps | EditorHeaderEditorProps;
export declare const EditorHeader: (props: EditorHeaderProps) => JSX.Element;
export {};
//# sourceMappingURL=EditorHeader.d.ts.map