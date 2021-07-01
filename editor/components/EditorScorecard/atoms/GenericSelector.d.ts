interface GenericSelectorProps {
    id: string;
    items: Array<string | GenericSelectorOption>;
    selection: string | undefined;
    onSelect: (_selection: string) => void;
    isDisabled?: boolean;
}
export declare const GenericSelector: (props: GenericSelectorProps) => JSX.Element;
export interface GenericSelectorOption {
    value: string;
    isDisabled?: boolean;
}
export {};
//# sourceMappingURL=GenericSelector.d.ts.map