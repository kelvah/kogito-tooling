import { WritableDraft } from "immer/dist/types/types-external";
import { PMML } from "@kogito-tooling/pmml-editor-marshaller/dist/marshaller/model";
import { Path } from "../paths";
interface Change {
    path: Path | null;
    change: any;
    reverse: any;
}
export declare type Listener = (id: string) => void;
export declare class HistoryService {
    private readonly listeners;
    private pending;
    private readonly history;
    constructor(listeners: Listener[]);
    batch: <M>(state: M, path: Path | null, recipe: (draft: WritableDraft<M>) => void, validate?: ((pmml: PMML) => void) | undefined) => void;
    commit: (state: PMML | undefined) => PMML | undefined;
    private mutate;
    undo: (state: PMML) => PMML;
    redo: (state: PMML) => PMML;
    index: () => number;
    changes: () => Change[];
    private apply;
}
export {};
//# sourceMappingURL=HistoryProvider.d.ts.map