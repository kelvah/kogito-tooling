import { Path } from "../paths";
import { ValidationEntry } from "./ValidationRegistry";
export declare class ValidationStore {
    private readonly registry;
    set: (path: Path, entry: ValidationEntry) => void;
    get: (path: Path) => ValidationEntry[];
    private childPath;
    clear: (path: Path) => void;
}
//# sourceMappingURL=ValidationStore.d.ts.map