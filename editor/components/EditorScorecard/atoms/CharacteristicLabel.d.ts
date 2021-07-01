import "./CharacteristicLabel.scss";
import { ValidationEntry } from "../../../validation";
import { DataField, Predicate } from "@kogito-tooling/pmml-editor-marshaller";
interface CharacteristicLabelProps {
    name: string;
    value: string;
}
export declare const CharacteristicLabel: (props: CharacteristicLabelProps) => JSX.Element;
export declare const CharacteristicPredicateLabel: (predicate: Predicate | undefined, dataFields: DataField[], validations: ValidationEntry[]) => JSX.Element;
export {};
//# sourceMappingURL=CharacteristicLabel.d.ts.map