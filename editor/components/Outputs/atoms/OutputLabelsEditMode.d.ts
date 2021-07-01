import { FieldName, OpType, OutputField, RankOrder, ResultFeature } from "@kogito-tooling/pmml-editor-marshaller";
import { ValidationEntry } from "../../../validation";
interface OutputLabelsEditModeProps {
    optype: OpType | undefined;
    setOptype: (optype: OpType | undefined) => void;
    targetField: FieldName | undefined;
    setTargetField: (targetField: FieldName | undefined) => void;
    targetFieldValidation: ValidationEntry[];
    feature: ResultFeature | undefined;
    setFeature: (feature: ResultFeature | undefined) => void;
    value: any | undefined;
    setValue: (value: any | undefined) => void;
    rank: number | undefined;
    setRank: (rank: number | undefined) => void;
    rankOrder: RankOrder | undefined;
    setRankOrder: (rankOrder: RankOrder | undefined) => void;
    segmentId: string | undefined;
    setSegmentId: (segmentId: string | undefined) => void;
    isFinalResult: boolean | undefined;
    setIsFinalResult: (isFinalResult: boolean | undefined) => void;
    commit: (outputField: Partial<OutputField>) => void;
    viewExtendedProperties: () => void;
    isDisabled: boolean;
}
export declare const OutputLabelsEditMode: (props: OutputLabelsEditModeProps) => JSX.Element;
export {};
//# sourceMappingURL=OutputLabelsEditMode.d.ts.map