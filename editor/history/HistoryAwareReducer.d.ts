import { Reducer } from "react";
import { HistoryService } from "./HistoryProvider";
import { ModelType } from "..";
import { Model } from "@kogito-tooling/pmml-editor-marshaller";
import { ValidationRegistry } from "../validation";
export declare type HistoryAwareReducer<S, A> = (historyService: HistoryService) => Reducer<S, A>;
export declare type HistoryAwareValidatingReducer<S, A> = (historyService: HistoryService, validationRegistry: ValidationRegistry) => Reducer<S, A>;
export interface ModelReducerBinding<S, A> {
    reducer: Reducer<S, A>;
    factory: (data: S) => S;
}
export declare type HistoryAwareModelReducer<A> = (historyService: HistoryService, modelReducers: Map<ModelType, ModelReducerBinding<any, any>>) => Reducer<Model[], A>;
//# sourceMappingURL=HistoryAwareReducer.d.ts.map