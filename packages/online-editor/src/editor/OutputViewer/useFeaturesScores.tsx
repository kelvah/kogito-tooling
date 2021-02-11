import { useEffect, useState } from "react";
import { orderBy, find } from "lodash";
import { FeatureScores, Saliencies } from "../ModelTester/ModelTester";

const useFeaturesScores = (saliencies: Saliencies, outcomeName: string | undefined) => {
  const [featuresScores, setFeaturesScores] = useState<FeatureScores[]>([]);
  const [topFeaturesScores, setTopFeaturesScores] = useState<FeatureScores[]>([]);

  useEffect(() => {
    if (saliencies.status === "SUCCEEDED" && outcomeName) {
      const selectedExplanation = find(saliencies.saliencies, saliency => {
        return saliency.outcomeName === outcomeName;
      });

      if (selectedExplanation) {
        const sortedFeatures = orderBy(
          selectedExplanation.featureImportance,
          item => Math.abs(item.featureScore),
          "asc"
        );
        setFeaturesScores(sortedFeatures as FeatureScores[]);
        if (sortedFeatures.length > 10) {
          setTopFeaturesScores(sortedFeatures.slice(sortedFeatures.length - 10));
        }
      }
    }
  }, [saliencies, outcomeName]);

  return { featuresScores, topFeaturesScores };
};

export default useFeaturesScores;
