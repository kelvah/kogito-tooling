import { Path } from "../paths";
import { ValidationLevel } from "./ValidationLevel";
export declare class ValidationEntry {
    level: ValidationLevel;
    message?: string | undefined;
    constructor(level: ValidationLevel, message?: string | undefined);
}
export declare class ValidationRegistry {
    private readonly store;
    set: (path: Path, entry: ValidationEntry) => void;
    get: (path: Path) => ValidationEntry[];
    clear: (path: Path) => void;
}
//# sourceMappingURL=ValidationRegistry.d.ts.map