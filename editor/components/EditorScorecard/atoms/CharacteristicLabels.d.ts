import { Characteristic } from "@kogito-tooling/pmml-editor-marshaller";
interface CharacteristicLabelsProps {
    modelIndex: number;
    characteristicIndex: number;
    activeCharacteristic: Characteristic;
    areReasonCodesUsed: boolean;
    scorecardBaselineScore: number | undefined;
}
export declare const CharacteristicLabels: (props: CharacteristicLabelsProps) => JSX.Element;
export {};
//# sourceMappingURL=CharacteristicLabels.d.ts.map