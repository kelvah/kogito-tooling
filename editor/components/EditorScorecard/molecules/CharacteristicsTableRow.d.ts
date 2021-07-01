import { DataField } from "@kogito-tooling/pmml-editor-marshaller";
import { IndexedCharacteristic } from "../organisms";
import "./CharacteristicsTableRow.scss";
interface CharacteristicsTableRowProps {
    modelIndex: number;
    characteristicIndex: number;
    characteristic: IndexedCharacteristic;
    areReasonCodesUsed: boolean;
    scorecardBaselineScore: number | undefined;
    dataFields: DataField[];
    onEdit: () => void;
    onDelete: () => void;
}
export declare const CharacteristicsTableRow: (props: CharacteristicsTableRowProps) => JSX.Element;
export {};
//# sourceMappingURL=CharacteristicsTableRow.d.ts.map