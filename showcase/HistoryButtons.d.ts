import "./HistoryButtons.scss";
export declare enum Theme {
    LIGHT = 0,
    DARK = 1
}
interface HistoryButtonsProps {
    undo: () => void;
    redo: () => void;
    get: () => Promise<string>;
    setTheme: (theme: Theme) => void;
    validate: () => void;
}
export declare const HistoryButtons: (props: HistoryButtonsProps) => JSX.Element;
export {};
//# sourceMappingURL=HistoryButtons.d.ts.map