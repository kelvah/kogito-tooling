import * as React from "react";
import { Operation } from "./components/EditorScorecard";
import { KogitoEdit } from "@kogito-tooling/workspace/dist/api";
import { Notification } from "@kogito-tooling/notifications/dist/api";
interface Props {
    exposing: (s: PMMLEditor) => void;
    ready: () => void;
    newEdit: (edit: KogitoEdit) => void;
    setNotifications: (path: string, notifications: Notification[]) => void;
}
export interface State {
    path: string;
    content: string;
    originalContent: string;
    activeOperation: Operation;
}
export declare class PMMLEditor extends React.Component<Props, State> {
    private store;
    private readonly history;
    private readonly validationRegistry;
    private readonly reducer;
    constructor(props: Props);
    componentDidMount(): void;
    setContent(path: string, content: string): Promise<void>;
    private doSetContent;
    getContent(): Promise<string>;
    private doGetContent;
    undo(): Promise<void>;
    private doUndo;
    redo(): Promise<void>;
    private doRedo;
    validate(): Notification[];
    private isSingleModel;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=PMMLEditor.d.ts.map