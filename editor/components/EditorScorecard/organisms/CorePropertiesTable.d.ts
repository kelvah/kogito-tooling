import { BaselineMethod, MiningFunction, ReasonCodeAlgorithm } from "@kogito-tooling/pmml-editor-marshaller";
import "./CorePropertiesTable.scss";
interface CoreProperties {
    modelIndex: number;
    isScorable: boolean | undefined;
    functionName: MiningFunction | undefined;
    algorithmName: string | undefined;
    baselineScore: number | undefined;
    baselineMethod: BaselineMethod | undefined;
    initialScore: number | undefined;
    areReasonCodesUsed: boolean;
    reasonCodeAlgorithm: ReasonCodeAlgorithm | undefined;
}
interface CorePropertiesTableProps extends CoreProperties {
    isBaselineScoreDisabled: boolean;
    commit: (props: CoreProperties) => void;
}
export declare const CorePropertiesTable: (props: CorePropertiesTableProps) => JSX.Element;
export {};
//# sourceMappingURL=CorePropertiesTable.d.ts.map