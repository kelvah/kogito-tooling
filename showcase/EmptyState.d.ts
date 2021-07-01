interface NewProps {
    newContent: () => void;
}
interface UploadProps {
    setContent: (path: string, xml: string) => void;
}
interface AllProps extends NewProps, UploadProps {
}
export declare const PMMLEmptyState: (props: AllProps) => JSX.Element;
export {};
//# sourceMappingURL=EmptyState.d.ts.map