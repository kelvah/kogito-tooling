export declare class Line {
    readonly m: number;
    readonly c: number;
    readonly title: string;
    constructor(m: number, c: number, title: string);
}
export declare class Range {
    readonly min: number;
    readonly max: number;
    constructor(min: number, max: number);
}
interface LinearRegressionViewProps {
    modelName: string;
    independentAxisTitle: string;
    dependentAxisTitle: string;
    width?: number;
    height?: number;
    lines: Line[];
    rangeX: Range;
    rangeY: Range;
}
export declare const LinearRegressionView: (props: LinearRegressionViewProps) => JSX.Element;
export {};
//# sourceMappingURL=LinearRegressionView.d.ts.map