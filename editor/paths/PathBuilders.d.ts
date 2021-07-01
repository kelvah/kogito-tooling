export interface Path {
    readonly path: string;
}
declare class Builders {
    readonly builders: BaseBuilder[];
    constructor(builders: BaseBuilder[]);
    add(builder: BaseBuilder): void;
}
declare abstract class BaseBuilder {
    protected readonly builders: Builders;
    constructor(builders: Builders);
    protected abstract segment(): string;
    build(): Path;
}
export declare const Builder: () => PMMLBuilder;
declare class PMMLBuilder extends BaseBuilder {
    constructor();
    forHeader: () => HeaderBuilder;
    forDataDictionary: () => DataDictionaryBuilder;
    forModel: (modelIndex?: number | undefined) => ModelBuilder;
    protected segment(): string;
}
declare class ModelBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly modelIndex?;
    constructor(builders: Builders, modelIndex?: number | undefined);
    forBaselineScore: () => BaselineScoreBuilder;
    forUseReasonCodes: () => UseReasonCodesBuilder;
    forCharacteristics: () => CharacteristicsBuilder;
    forMiningSchema: () => MiningSchemaBuilder;
    forOutput: () => OutputBuilder;
    protected segment(): string;
}
declare class HeaderBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class DataDictionaryBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    forDataField: (dataFieldIndex?: number | undefined) => DataFieldBuilder;
    protected segment(): string;
}
declare class DataFieldBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly dataFieldIndex?;
    constructor(builders: Builders, dataFieldIndex?: number | undefined);
    forInterval: (intervalIndex?: number | undefined) => IntervalBuilder;
    forValue: (valueIndex?: number | undefined) => ValueBuilder;
    protected segment(): string;
}
declare class IntervalBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly intervalIndex?;
    constructor(builders: Builders, intervalIndex?: number | undefined);
    protected segment(): string;
}
declare class ValueBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly valueIndex?;
    constructor(builders: Builders, valueIndex?: number | undefined);
    protected segment(): string;
}
declare class CharacteristicsBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    forCharacteristic: (characteristicIndex?: number | undefined) => CharacteristicBuilder;
    protected segment(): string;
}
declare class CharacteristicBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly characteristicIndex?;
    constructor(builders: Builders, characteristicIndex?: number | undefined);
    forReasonCode: () => ReasonCodeBuilder;
    forBaselineScore: () => BaselineScoreBuilder;
    forAttribute: (attributeIndex?: number | undefined) => AttributeBuilder;
    protected segment(): string;
}
declare class ReasonCodeBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class BaselineScoreBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class UseReasonCodesBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class AttributeBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly attributeIndex?;
    constructor(builders: Builders, attributeIndex?: number | undefined);
    forPredicate: (predicateIndex?: number | undefined) => PredicateBuilder;
    forReasonCode: () => ReasonCodeBuilder;
    forPartialScore: () => PartialScoreBuilder;
    protected segment(): string;
}
declare class PartialScoreBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class PredicateBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly predicateIndex?;
    constructor(builders: Builders, predicateIndex?: number | undefined);
    forFieldName: () => FieldNameBuilder;
    protected segment(): string;
}
declare class FieldNameBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class MiningSchemaBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    forMiningField: (miningFieldIndex?: number | undefined) => MiningFieldBuilder;
    protected segment(): string;
}
declare class MiningFieldBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly miningFieldIndex?;
    constructor(builders: Builders, miningFieldIndex?: number | undefined);
    forImportance: () => MiningFieldImportanceBuilder;
    forLowValue: () => MiningFieldLowValueBuilder;
    forHighValue: () => MiningFieldHighValueBuilder;
    forMissingValueReplacement: () => MiningFieldMissingValueReplacementBuilder;
    forInvalidValueReplacement: () => MiningFieldInvalidValueReplacementBuilder;
    forDataFieldMissing: () => MiningFieldDataFieldMissingBuilder;
    protected segment(): string;
}
declare class MiningFieldImportanceBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class MiningFieldLowValueBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class MiningFieldHighValueBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class MiningFieldMissingValueReplacementBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class MiningFieldInvalidValueReplacementBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class MiningFieldDataFieldMissingBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
declare class OutputBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    forOutputField: (outputFieldIndex?: number | undefined) => OutputFieldBuilder;
    protected segment(): string;
}
declare class OutputFieldBuilder extends BaseBuilder {
    protected builders: Builders;
    private readonly outputFieldIndex?;
    constructor(builders: Builders, outputFieldIndex?: number | undefined);
    forTargetField: () => OutputFieldTargetFieldBuilder;
    protected segment(): string;
}
declare class OutputFieldTargetFieldBuilder extends BaseBuilder {
    protected builders: Builders;
    constructor(builders: Builders);
    protected segment(): string;
}
export {};
//# sourceMappingURL=PathBuilders.d.ts.map