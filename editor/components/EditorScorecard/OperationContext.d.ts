import * as React from "react";
import { Operation } from "./Operation";
export interface ActiveOperation {
    activeOperation: Operation;
    setActiveOperation: (operation: Operation) => void;
}
export declare const OperationContext: React.Context<ActiveOperation>;
export declare function useOperation(): ActiveOperation;
//# sourceMappingURL=OperationContext.d.ts.map