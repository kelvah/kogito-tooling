import * as React from "react";
import { PMML } from "@kogito-tooling/pmml-editor-marshaller";
import { HistoryService } from "./HistoryProvider";
export interface History {
    service: HistoryService;
    getCurrentState: () => PMML | undefined;
}
export declare const HistoryContext: React.Context<History>;
export declare function useHistoryService(): History;
//# sourceMappingURL=HistoryContext.d.ts.map