import { HistoryService } from "./HistoryProvider";
import { Dispatch } from "redux";
import { PMML } from "@kogito-tooling/pmml-editor-marshaller";
export declare const useBatchDispatch: (service: HistoryService, getCurrentState: () => PMML | undefined) => Dispatch<any>;
//# sourceMappingURL=BatchDispatchHook.d.ts.map