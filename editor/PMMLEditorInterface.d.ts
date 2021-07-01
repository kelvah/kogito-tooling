import { Editor, KogitoEditorChannelApi, KogitoEditorEnvelopeContextType } from "@kogito-tooling/editor/dist/api";
import { Notification } from "@kogito-tooling/notifications/dist/api";
export declare class PMMLEditorInterface implements Editor {
    private readonly envelopeContext;
    private self;
    af_isReact: boolean;
    af_componentId: "pmml-editor";
    af_componentTitle: "PMML Editor";
    constructor(envelopeContext: KogitoEditorEnvelopeContextType<KogitoEditorChannelApi>);
    getElementPosition(): Promise<import("@kogito-tooling/guided-tour/dist/api").Rect>;
    setContent(path: string, content: string): Promise<void>;
    getContent(): Promise<string>;
    getPreview(): Promise<string | undefined>;
    af_componentRoot(): JSX.Element;
    undo(): Promise<void>;
    redo(): Promise<void>;
    validate(): Promise<Notification[]>;
}
//# sourceMappingURL=PMMLEditorInterface.d.ts.map