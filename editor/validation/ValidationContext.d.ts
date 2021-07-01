import * as React from "react";
import { ValidationRegistry } from "./ValidationRegistry";
export interface Validation {
    validationRegistry: ValidationRegistry;
}
export declare const ValidationContext: React.Context<Validation>;
export declare function useValidationRegistry(): Validation;
//# sourceMappingURL=ValidationContext.d.ts.map