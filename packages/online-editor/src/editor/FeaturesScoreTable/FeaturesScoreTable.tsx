import * as React from "react";
import { DataList, DataListCell, DataListItem, DataListItemCells, DataListItemRow } from "@patternfly/react-core";
import { formattedScore } from "../FeaturesScoreChart/FeaturesScoreChart";
import { FeatureScores } from "../ModelTester/ModelTester";
import "./FeaturesScoreTable.scss";

interface FeatureScoreTableProps {
  featuresScore: FeatureScores[];
}

const FeaturesScoreTable = (props: FeatureScoreTableProps) => {
  const { featuresScore } = props;
  const positiveScores = featuresScore.filter(item => item.featureScore >= 0).reverse();
  const negativeScores = featuresScore.filter(item => item.featureScore < 0).reverse();

  return (
    <section className="feature-score-table">
      {positiveScores && <ScoreTable name="Positive Weight" featuresScore={positiveScores} />}
      {negativeScores && <ScoreTable name="Negative Weight" featuresScore={negativeScores} />}
    </section>
  );
};

interface ScoreTableProps {
  name: string;
  featuresScore: FeatureScores[];
}

const ScoreTable = (props: ScoreTableProps) => {
  const { name, featuresScore } = props;
  return (
    <DataList aria-label="Features Scores" className="pf-m-compact score-table">
      <DataListItem aria-labelledby="scores" className="score-table__heading">
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell key="primary heading" width={2}>
                <strong>{name}</strong>
              </DataListCell>,
              <DataListCell key="secondary heading">
                <strong>Score</strong>
              </DataListCell>
            ]}
          />
        </DataListItemRow>
      </DataListItem>
      {featuresScore.map(item => (
        <DataListItem key={item.featureName} aria-labelledby={`feature-${item.featureName.replace(" ", "-")}`}>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="feature-name" width={2}>
                  <span id="simple-item2">{item.featureName}</span>
                </DataListCell>,
                <DataListCell key="feature-score">{formattedScore(item.featureScore)}</DataListCell>
              ]}
            />
          </DataListItemRow>
        </DataListItem>
      ))}
    </DataList>
  );
};

export default FeaturesScoreTable;
