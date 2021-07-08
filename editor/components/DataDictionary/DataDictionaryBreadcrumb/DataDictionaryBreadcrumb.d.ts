import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
interface DataDictionaryBreadcrumbProps {
    dataDictionary: DDDataField[];
    paths: Array<number>;
    onNavigate: (path: Array<number>) => void;
}
declare const DataDictionaryBreadcrumb: (props: DataDictionaryBreadcrumbProps) => JSX.Element;
export default DataDictionaryBreadcrumb;
//# sourceMappingURL=DataDictionaryBreadcrumb.d.ts.map