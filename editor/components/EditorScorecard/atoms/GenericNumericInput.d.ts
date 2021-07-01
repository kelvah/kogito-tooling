import { Validated } from "../../../types";
interface GenericNumericInputProps {
    id: string;
    value: number;
    validated: Validated;
    onChange: (_value: number) => void;
    onBlur: () => void;
}
export declare const GenericNumericInput: (props: GenericNumericInputProps) => JSX.Element;
export {};
//# sourceMappingURL=GenericNumericInput.d.ts.map