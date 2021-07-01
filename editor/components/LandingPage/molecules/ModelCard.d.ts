import { ModelType } from "../../..";
import "./ModelCard.scss";
interface ModelCardProps {
    index: number | undefined;
    modelName: string;
    modelType: ModelType;
    onDelete: (index: number) => void;
    onClick: (index: number) => void;
}
export declare const ModelCard: (props: ModelCardProps) => JSX.Element;
export {};
//# sourceMappingURL=ModelCard.d.ts.map