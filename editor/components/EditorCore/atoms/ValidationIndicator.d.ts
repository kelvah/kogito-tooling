import * as React from "react";
import { ReactElement } from "react";
import "./ModelTitle.scss";
import { ValidationEntry } from "../../../validation";
interface ValidationIndicatorProps {
    validations: ValidationEntry[];
}
export declare const ValidationIndicator: (props: ValidationIndicatorProps) => JSX.Element;
interface ValidationIndicatorTooltipProps extends ValidationIndicatorProps {
    children: ReactElement<any>;
    customTooltipContent?: string;
}
export declare const ValidationIndicatorTooltip: (props: ValidationIndicatorTooltipProps) => JSX.Element;
interface ValidationIndicatorLabelProps extends ValidationIndicatorProps {
    children: React.ReactNode;
    customTooltipContent?: string;
    onClose?: (event: React.MouseEvent) => void;
    cssClass?: string;
}
export declare const ValidationIndicatorLabel: (props: ValidationIndicatorLabelProps) => JSX.Element;
export {};
//# sourceMappingURL=ValidationIndicator.d.ts.map