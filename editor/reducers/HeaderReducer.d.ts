import { ActionMap, Actions, AllActions } from "./Actions";
import { Header } from "@kogito-tooling/pmml-editor-marshaller";
import { HistoryAwareReducer } from "../history";
interface HeaderPayload {
    [Actions.SetHeaderDescription]: {
        readonly description: string;
    };
}
export declare type HeaderActions = ActionMap<HeaderPayload>[keyof ActionMap<HeaderPayload>];
export declare const HeaderReducer: HistoryAwareReducer<Header, AllActions>;
export {};
//# sourceMappingURL=HeaderReducer.d.ts.map