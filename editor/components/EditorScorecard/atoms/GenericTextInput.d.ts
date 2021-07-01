import { Validated } from "../../../types";
interface GenericTextInputProps {
    id: string;
    value: string | undefined;
    validated: Validated;
    onChange: (_value: string) => void;
    onBlur: () => void;
}
export declare const GenericTextInput: (props: GenericTextInputProps) => JSX.Element;
export {};
//# sourceMappingURL=GenericTextInput.d.ts.map