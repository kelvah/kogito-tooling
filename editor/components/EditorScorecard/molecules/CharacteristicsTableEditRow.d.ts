import "./CharacteristicsTableRow.scss";
import "../../EditorScorecard/templates/ScorecardEditorPage.scss";
import { IndexedCharacteristic } from "../organisms";
import { Characteristic } from "@kogito-tooling/pmml-editor-marshaller";
interface CharacteristicsTableEditRowProps {
    modelIndex: number;
    areReasonCodesUsed: boolean;
    scorecardBaselineScore: number | undefined;
    characteristic: IndexedCharacteristic;
    validateCharacteristicName: (name: string | undefined) => boolean;
    viewAttribute: (index: number | undefined) => void;
    onAddAttribute: () => void;
    onCommitAndClose: () => void;
    onCommit: (partial: Partial<Characteristic>) => void;
    onCancel: () => void;
}
export declare const CharacteristicsTableEditRow: (props: CharacteristicsTableEditRowProps) => JSX.Element;
export {};
//# sourceMappingURL=CharacteristicsTableEditRow.d.ts.map