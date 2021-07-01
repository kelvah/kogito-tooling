import { Characteristic } from "@kogito-tooling/pmml-editor-marshaller";
export interface IndexedCharacteristic {
    index: number;
    characteristic: Characteristic;
}
interface CharacteristicsTableProps {
    modelIndex: number;
    areReasonCodesUsed: boolean;
    scorecardBaselineScore: number | undefined;
    characteristics: IndexedCharacteristic[];
    characteristicsUnfilteredLength: number;
    selectedCharacteristicIndex: number | undefined;
    setSelectedCharacteristicIndex: (index: number | undefined) => void;
    validateCharacteristicName: (index: number | undefined, name: string | undefined) => boolean;
    viewAttribute: (index: number | undefined) => void;
    deleteCharacteristic: (index: number) => void;
    onAddAttribute: () => void;
    onCommitAndClose: () => void;
    onCommit: (partial: Partial<Characteristic>) => void;
    onCancel: () => void;
}
export declare const CharacteristicsTable: (props: CharacteristicsTableProps) => JSX.Element;
export {};
//# sourceMappingURL=CharacteristicsTable.d.ts.map