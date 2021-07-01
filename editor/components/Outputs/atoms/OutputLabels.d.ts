import { FieldName, OpType, RankOrder, ResultFeature } from "@kogito-tooling/pmml-editor-marshaller";
import { ValidationEntry } from "../../../validation";
interface OutputLabelsProps {
    optype: OpType | undefined;
    targetField: FieldName | undefined;
    targetFieldValidation: ValidationEntry[];
    feature: ResultFeature | undefined;
    value: any | undefined;
    rank: number | undefined;
    rankOrder: RankOrder | undefined;
    segmentId: string | undefined;
    isFinalResult: boolean | undefined;
}
export declare const OutputLabels: (props: OutputLabelsProps) => JSX.Element;
export {};
//# sourceMappingURL=OutputLabels.d.ts.map