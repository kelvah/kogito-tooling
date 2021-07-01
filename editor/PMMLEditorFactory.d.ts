import { Editor, EditorFactory, EditorInitArgs, KogitoEditorEnvelopeContextType, KogitoEditorChannelApi } from "@kogito-tooling/editor/dist/api";
export declare const FACTORY_TYPE = "pmml";
export declare class PMMLEditorFactory implements EditorFactory<Editor, KogitoEditorChannelApi> {
    createEditor(envelopeContext: KogitoEditorEnvelopeContextType<KogitoEditorChannelApi>, initArgs: EditorInitArgs): Promise<Editor>;
}
//# sourceMappingURL=PMMLEditorFactory.d.ts.map