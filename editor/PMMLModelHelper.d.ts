import { Characteristics, DataDictionary, MiningField, MiningSchema, Model, Output, PMML } from "@kogito-tooling/pmml-editor-marshaller";
export declare type ModelType = "Anomaly Detection Model" | "card-icon-default.svg" | "Association Model" | "Bayesian Network Model" | "Baseline Model" | "Clustering Model" | "Gaussian Process Model" | "General Regression Model" | "Mining Model" | "Naive Bayes Model" | "Nearest Neighbor Model" | "Neural Network" | "Regression Model" | "RuleSet Model" | "Sequence Model" | "Scorecard" | "Support Vector Machine Model" | "Text Model" | "Time Series Model" | "Tree Model" | undefined;
export declare enum SupportedCapability {
    NONE = 0,
    VIEWER = 1,
    EDITOR = 2
}
export interface PMMLModelMapping<M> {
    model: M;
    type: ModelType;
    iconUrl: string;
    capability: SupportedCapability;
    factory: (() => M) | undefined;
}
export declare const PMMLModels: Array<PMMLModelMapping<any>>;
export declare const isCollection: <T>(collection: T[] | undefined) => boolean;
export declare const getModelName: (model: Model) => string;
export declare const getModelType: (model: Model) => ModelType | undefined;
export declare const getModelIconUrlByType: (type: ModelType) => string;
export declare const isSupportedModelType: (model: Model) => boolean;
export declare const findIncrementalName: (name: string, existingNames: string[], startsFrom: number) => string;
export declare const getDataDictionary: (pmml: PMML) => DataDictionary | undefined;
export declare const getMiningSchema: (pmml: PMML, modelIndex: number) => MiningSchema | undefined;
export declare const getMiningField: (pmml: PMML, modelIndex: number, miningFieldIndex: number) => MiningField | undefined;
export declare const getOutputs: (pmml: PMML, modelIndex: number) => Output | undefined;
export declare const getCharacteristics: (pmml: PMML, modelIndex: number) => Characteristics | undefined;
export declare const getBaselineScore: (pmml: PMML, modelIndex: number) => number | undefined;
export declare const getUseReasonCodes: (pmml: PMML, modelIndex: number) => boolean | undefined;
//# sourceMappingURL=PMMLModelHelper.d.ts.map