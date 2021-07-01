import "./CharacteristicsContainer.scss";
import { Characteristic } from "@kogito-tooling/pmml-editor-marshaller";
interface CharacteristicsContainerProps {
    modelIndex: number;
    areReasonCodesUsed: boolean;
    scorecardBaselineScore: number | undefined;
    characteristics: Characteristic[];
}
export declare const CharacteristicsContainer: (props: CharacteristicsContainerProps) => JSX.Element;
export {};
//# sourceMappingURL=CharacteristicsContainer.d.ts.map